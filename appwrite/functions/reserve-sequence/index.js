const sdk = require('node-appwrite');

// Appwrite Function: Reserve sequential IDs per responsavelId
// Input (JSON): { responsavelId: string, count: number }
// Output (JSON): { ok: boolean, start?: number, message?: string }

module.exports = async function (req, res) {
  const log = (...args) => req.log ? req.log.apply(null, args) : console.log(...args);
  const error = (...args) => req.error ? req.error.apply(null, args) : console.error(...args);

  try {
    if (req.method && req.method.toUpperCase() === 'GET') {
      return res.json({ ok: true, message: 'Use POST with JSON body { responsavelId, count }' });
    }

    let body = {};
    try {
      body = req.body ? JSON.parse(req.body) : {};
    } catch (e) {
      return res.json({ ok: false, message: 'Body inválido. Envie JSON.' }, 400);
    }

    const responsavelId = String(body.responsavelId || '').trim();
    const count = Number(body.count || 0);
    if (!responsavelId) {
      return res.json({ ok: false, message: 'responsavelId é obrigatório' }, 400);
    }
    if (!Number.isInteger(count) || count <= 0 || count > 5000) {
      return res.json({ ok: false, message: 'count deve ser um inteiro entre 1 e 5000' }, 400);
    }

    const endpoint = process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId) {
      return res.json({ ok: false, message: 'Variáveis de ambiente do Appwrite ausentes (ENDPOINT/PROJECT)' }, 500);
    }
    if (!apiKey) {
      return res.json({ ok: false, message: 'APPWRITE_API_KEY não configurada na Function' }, 500);
    }

    const client = new sdk.Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

  const databases = new sdk.Databases(client);

  // Ajuste conforme seu projeto
  const databaseId = process.env.DATABASE_ID || 'sistema';
  const countersCollection = process.env.COUNTERS_COLLECTION_ID || 'finance_counters';
  const locksCollection = process.env.LOCKS_COLLECTION_ID || 'finance_locks';

  const lockId = `lock_${responsavelId}`;
  const now = new Date();
  const ttlMs = Number(process.env.LOCK_TTL_MS || 15000); // 15s

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Try acquire lock with retries
    const acquireLock = async () => {
      const maxAttempts = 20; // ~5s max at 250ms interval
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          // Coleção de locks sem atributos: criar documento vazio
          await databases.createDocument(databaseId, locksCollection, lockId, {});
          return true;
        } catch (e) {
          // If exists, check expiry
          try {
            const doc = await databases.getDocument(databaseId, locksCollection, lockId);
            // Sem atributos customizados; usar $updatedAt como referência de expiração
            const updatedAt = new Date(doc.$updatedAt || 0).getTime();
            const age = Date.now() - updatedAt;
            if (age > ttlMs) {
              // expirado -> limpar
              try { await databases.deleteDocument(databaseId, locksCollection, lockId); } catch (_) {}
            }
          } catch (_) {
            // not found, will retry
          }
          await sleep(250);
        }
      }
      return false;
    };

    const releaseLock = async () => {
      try { await databases.deleteDocument(databaseId, locksCollection, lockId); } catch (_) {}
    };

    const locked = await acquireLock();
    if (!locked) {
      return res.json({ ok: false, message: 'Não foi possível obter lock. Tente novamente.' }, 429);
    }

    let start;
    try {
      // Read or create counter (atributo único: nextSeq)
      let counter;
      try {
        counter = await databases.getDocument(databaseId, countersCollection, responsavelId);
      } catch (e) {
        // Create with next=1
        try {
          counter = await databases.createDocument(databaseId, countersCollection, responsavelId, {
            nextSeq: 1,
          });
        } catch (e2) {
          // Possible race: read again
          counter = await databases.getDocument(databaseId, countersCollection, responsavelId);
        }
      }

      const current = Number(counter.nextSeq || 1);
      start = current;
      const newNext = current + count;

      await databases.updateDocument(databaseId, countersCollection, responsavelId, {
        nextSeq: newNext,
      });

      return res.json({ ok: true, start });
    } catch (e) {
      error('Erro ao reservar sequência:', e);
      return res.json({ ok: false, message: 'Erro interno ao reservar sequência' }, 500);
    } finally {
      await releaseLock();
    }
  } catch (e) {
    return res.json({ ok: false, message: 'Erro inesperado' }, 500);
  }
};
