import { Client, Databases, Account, Storage } from 'appwrite';

class AppwriteService {
  // Método ping para checar conexão com Appwrite
  async ping() {
    if (!this.initialized) return Promise.reject('Appwrite não inicializado');
    try {
      // Tenta buscar informações do projeto (ou qualquer endpoint público)
      await this.client.call('GET', '/health');
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
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

  // Métodos para Alunos
  async createStudent(databaseId, collectionId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        data
      );
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      throw error;
    }
  }

  async getStudents(databaseId, collectionId, queries = []) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.listDocuments(
        databaseId,
        collectionId,
        queries
      );
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw error;
    }
  }

  async updateStudent(databaseId, collectionId, documentId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
      );
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      throw error;
    }
  }

  async deleteStudent(databaseId, collectionId, documentId) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.deleteDocument(
        databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      throw error;
    }
  }

  // Métodos para Responsáveis
  async createResponsible(databaseId, collectionId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        data
      );
    } catch (error) {
      console.error('Erro ao criar responsável:', error);
      throw error;
    }
  }

  // Métodos para Chamada
  async createAttendance(databaseId, collectionId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        data
      );
    } catch (error) {
      console.error('Erro ao registrar chamada:', error);
      throw error;
    }
  }

  // Métodos para Financeiro
  async createFinancialRecord(databaseId, collectionId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        data
      );
    } catch (error) {
      console.error('Erro ao criar registro financeiro:', error);
      throw error;
    }
  }

  // Método genérico para qualquer coleção
  async createDocument(databaseId, collectionId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        data
      );
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      throw error;
    }
  }

  async listDocuments(databaseId, collectionId, queries = []) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.listDocuments(
        databaseId,
        collectionId,
        queries
      );
    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      throw error;
    }
  }

  async updateDocument(databaseId, collectionId, documentId, data) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
      );
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  }

  async deleteDocument(databaseId, collectionId, documentId) {
    if (!this.initialized) throw new Error('Appwrite não inicializado');
    
    try {
      return await this.databases.deleteDocument(
        databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  }
}

export default new AppwriteService();
