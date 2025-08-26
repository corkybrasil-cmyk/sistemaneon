# Appwrite Functions — Reserva de Sequência

Esta função cria, de forma segura, uma sequência numérica por responsável (responsavelId), usada para gerar IDs como `responsavelId[n]` para lançamentos financeiros.

## Estrutura

- Função: `reserve-sequence`
- Runtime: Node.js 18 (CommonJS)
- Entrada (JSON): `{ responsavelId: string, count: number }`
- Saída (JSON): `{ ok: boolean, start?: number, message?: string }`

## Pré-requisitos no Appwrite

- Projeto e Database já criados. Este projeto usa:
  - Database: `sistema`
  - Collections:
    - `finance_counters` (documento por responsável, id = `responsavelId`)
      - Atributos: apenas `nextSeq` (integer)
    - `finance_locks` (locks de curta duração)
      - Sem atributos (a função usa o metadado `$updatedAt` para expiração)
  - A expiração do lock é baseada em `$updatedAt` + `LOCK_TTL_MS` (env da Function). Não é necessário índice adicional.

Permissões recomendadas (via API Key da Function):
- Databases: acesso de leitura/escrita no database `sistema` e nas coleções acima.

## Código da função

O código está em `appwrite/functions/reserve-sequence/`:
- `index.js`: lógica da função
- `package.json`: dependência `node-appwrite`

A função cria um documento de lock vazio (`finance_locks/lock_<responsavelId>`) e considera-o expirado quando o tempo desde `$updatedAt` ultrapassa `LOCK_TTL_MS`. Em seguida, usa/atualiza `finance_counters/<responsavelId>` incrementando o campo `nextSeq` para reservar o range solicitado.

## Deploy com Appwrite CLI (Windows PowerShell)

1) Instale o CLI (se necessário)

```powershell
npm i -g appwrite
```

2) Login e selecione o projeto

```powershell
appwrite login
appwrite client --set-endpoint https://cloud.appwrite.io/v1 --set-project <PROJECT_ID>
```

3) Crie a Function (uma vez)

```powershell
appwrite functions create --functionId reserve-sequence --name "reserve-sequence" --runtime node-18.0
```

4) Configure variáveis da Function

```powershell
# API Key com acesso às coleções do database "sistema"
appwrite functions update --functionId reserve-sequence --vars APPWRITE_API_KEY=<YOUR_API_KEY>

# (opcionais) override caso use names diferentes
appwrite functions update --functionId reserve-sequence --vars DATABASE_ID=sistema,COUNTERS_COLLECTION_ID=finance_counters,LOCKS_COLLECTION_ID=finance_locks,LOCK_TTL_MS=15000
```

5) Deploy do código

```powershell
appwrite functions createDeployment --functionId reserve-sequence --entrypoint index.js --code .\appwrite\functions\reserve-sequence\ --activate true
```

6) Habilite execução com API Key do projeto (UI) ou garanta que a variável `APPWRITE_API_KEY` está definida.

## Usando no Frontend

No arquivo `.env` do frontend, defina o ID da function (não o nome):

```env
VITE_APPWRITE_RESERVE_FUNCTION_ID=reserve-sequence
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=<PROJECT_ID>
```

Depois, reinicie o dev server. O módulo `FinancialModule.jsx` já chama:

```js
const FUNCTION_ID = import.meta.env.VITE_APPWRITE_RESERVE_FUNCTION_ID || 'reserveFinanceSequence';
```

A execução retorna `{ ok: true, start }`. O frontend cria `count` documentos com IDs sequenciais a partir de `start`.

## Solução de problemas

- 400 Body inválido: verifique que o body é JSON e contém `responsavelId` e `count`.
- 429 Lock: muitas tentativas simultâneas. Tente novamente.
- 500 API Key ausente: defina `APPWRITE_API_KEY` na Function ou habilite execução com API Key do projeto.
- Permissões: garanta que a API Key tenha acesso de leitura/escrita às coleções `finance_counters` e `finance_locks`.
