import { Client, Databases, Account, Storage } from 'appwrite';

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.databases = null;
    this.account = null;
    this.storage = null;
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
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Erro ao inicializar Appwrite:', error);
      return false;
    }
  }

  // Métodos de autenticação
  async login(email, password) {
    if (!this.initialized || !this.account) throw new Error('Appwrite não inicializado');
    try {
      // Appwrite SDK v18.x: createSession replaces createEmailSession
      return await this.account.createSession(email, password);
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