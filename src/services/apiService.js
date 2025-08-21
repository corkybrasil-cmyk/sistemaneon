import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    // Interceptor para adicionar token de autenticação
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas e erros
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos para CRUD
  async get(endpoint, params = {}) {
    try {
      const response = await this.axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição GET ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await this.axios.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição POST ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint, data = {}) {
    try {
      const response = await this.axios.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição PUT ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição DELETE ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos específicos para alunos
  async getStudents(filters = {}) {
    return await this.get('/students', filters);
  }

  async createStudent(studentData) {
    return await this.post('/students', studentData);
  }

  async updateStudent(id, studentData) {
    return await this.put(`/students/${id}`, studentData);
  }

  async deleteStudent(id) {
    return await this.delete(`/students/${id}`);
  }

  // Métodos específicos para responsáveis
  async getResponsibles(filters = {}) {
    return await this.get('/responsibles', filters);
  }

  async createResponsible(responsibleData) {
    return await this.post('/responsibles', responsibleData);
  }

  async updateResponsible(id, responsibleData) {
    return await this.put(`/responsibles/${id}`, responsibleData);
  }

  // Métodos específicos para turmas
  async getClasses(filters = {}) {
    return await this.get('/classes', filters);
  }

  async createClass(classData) {
    return await this.post('/classes', classData);
  }

  async updateClass(id, classData) {
    return await this.put(`/classes/${id}`, classData);
  }

  // Métodos específicos para chamada
  async getAttendance(filters = {}) {
    return await this.get('/attendance', filters);
  }

  async createAttendance(attendanceData) {
    return await this.post('/attendance', attendanceData);
  }

  async updateAttendance(id, attendanceData) {
    return await this.put(`/attendance/${id}`, attendanceData);
  }

  // Métodos específicos para financeiro
  async getFinancialRecords(filters = {}) {
    return await this.get('/financial', filters);
  }

  async createFinancialRecord(financialData) {
    return await this.post('/financial', financialData);
  }

  async updateFinancialRecord(id, financialData) {
    return await this.put(`/financial/${id}`, financialData);
  }

  // Métodos específicos para ocorrências
  async getIncidents(filters = {}) {
    return await this.get('/incidents', filters);
  }

  async createIncident(incidentData) {
    return await this.post('/incidents', incidentData);
  }

  async updateIncident(id, incidentData) {
    return await this.put(`/incidents/${id}`, incidentData);
  }

  // Métodos específicos para contas a pagar
  async getAccountsPayable(filters = {}) {
    return await this.get('/accounts-payable', filters);
  }

  async createAccountPayable(accountData) {
    return await this.post('/accounts-payable', accountData);
  }

  async updateAccountPayable(id, accountData) {
    return await this.put(`/accounts-payable/${id}`, accountData);
  }

  // Métodos para relatórios e dashboards
  async getDashboardData() {
    return await this.get('/dashboard');
  }

  async getFinancialReport(startDate, endDate) {
    return await this.get('/reports/financial', { startDate, endDate });
  }

  async getAttendanceReport(classId, startDate, endDate) {
    return await this.get('/reports/attendance', { classId, startDate, endDate });
  }

  // Métodos para configurações
  async getConfigurations() {
    return await this.get('/config');
  }

  async updateConfigurations(configData) {
    return await this.put('/config', configData);
  }

  // Métodos para automações WhatsApp
  async sendWhatsAppMessage(data) {
    return await this.post('/whatsapp/send', data);
  }

  async getWhatsAppTemplates() {
    return await this.get('/whatsapp/templates');
  }

  // Webhooks
  async setupWebhook(webhookData) {
    return await this.post('/webhooks/setup', webhookData);
  }

  async getWebhooks() {
    return await this.get('/webhooks');
  }
}

export default new ApiService();
