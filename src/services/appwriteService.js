import { Client, Databases, Account, Storage, Functions } from 'appwrite';

class AppwriteService {
  async updateDocument(databaseId, collectionId, documentId, data) {
    if (!this.initialized || !this.databases) throw new Error('Appwrite não inicializado');
    try {
      return await this.databases.updateDocument(databaseId, collectionId, documentId, data);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  }
  async createDocument(databaseId, collectionId, documentId, data, permissions = []) {
    if (!this.initialized || !this.databases) throw new Error('Appwrite não inicializado');
    if (typeof data !== 'object' || data === null) throw new Error('Dados do documento devem ser um objeto válido');
    try {
      return await this.databases.createDocument(databaseId, collectionId, documentId, data, permissions);
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      throw error;
    }
  }
  async listDocuments(databaseId, collectionId, queries = []) {
    if (!this.initialized || !this.databases) throw new Error('Appwrite não inicializado');
    try {
      return await this.databases.listDocuments(databaseId, collectionId, queries);
    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      throw error;
    }
  }
  constructor() {
    this.client = new Client();
    this.databases = null;
    this.account = null;
    this.storage = null;
  this.functions = null;
    this.initialized = false;
  }

  initialize(endpoint, projectId) {
    if (!endpoint || !projectId) {
      console.warn('Appwrite endpoint or project ID not configured');
      return false;
    }
    try {
      this.client
        .setEndpoint(endpoint)
        .setProject(projectId);
      this.databases = new Databases(this.client);
      this.account = new Account(this.client);
      this.storage = new Storage(this.client);
      this.functions = new Functions(this.client);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Erro ao inicializar Appwrite:', error);
      return false;
    }
  }

  async executeFunction(functionId, data = {}, isAsync = false) {
    if (!this.initialized || !this.functions) throw new Error('Appwrite não inicializado');
    try {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      return await this.functions.createExecution(functionId, payload, isAsync);
    } catch (error) {
      console.error('Erro ao executar função:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(email, password) {
    if (!this.initialized || !this.account) throw new Error('Appwrite não inicializado');
    try {
      // Garante que não há sessão ativa antes de criar uma nova
      try {
        await this.logout();
      } catch (logoutError) {
        // Ignora erro de logout se não houver sessão
      }
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async logout() {
    if (!this.initialized || !this.account) throw new Error('Appwrite não inicializado');
    try {
      return await this.account.deleteSession('current');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    if (!this.initialized || !this.account) throw new Error('Appwrite não inicializado');
    try {
      return await this.account.get();
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      throw error;
    }
  }
}

export default new AppwriteService();