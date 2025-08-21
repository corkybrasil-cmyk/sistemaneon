import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
    this.accessToken = null;
    this.phoneNumberId = null;
  }

  initialize(accessToken, phoneNumberId) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  async sendMessage(to, message) {
    if (!this.accessToken || !this.phoneNumberId) {
      throw new Error('WhatsApp não configurado');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      throw error;
    }
  }

  async sendTemplateMessage(to, templateName, components = []) {
    if (!this.accessToken || !this.phoneNumberId) {
      throw new Error('WhatsApp não configurado');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'pt_BR' },
            components: components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error);
      throw error;
    }
  }

  // Templates específicos para o ERP escolar
  async sendAttendanceAlert(phoneNumber, studentName, date, status) {
    const message = status === 'falta' 
      ? `🚨 Alerta de Ausência\n\nO aluno ${studentName} não compareceu à aula hoje (${date}).\n\nEm caso de dúvidas, entre em contato conosco.`
      : `✅ Confirmação de Presença\n\nO aluno ${studentName} está presente na aula de hoje (${date}).`;

    return await this.sendMessage(phoneNumber, message);
  }

  async sendPaymentReminder(phoneNumber, studentName, amount, dueDate) {
    const message = `💰 Lembrete de Pagamento\n\nOlá! Este é um lembrete sobre a mensalidade do aluno ${studentName}.\n\nValor: R$ ${amount}\nVencimento: ${dueDate}\n\nPor favor, regularize o pagamento para evitar atrasos.`;

    return await this.sendMessage(phoneNumber, message);
  }

  async sendOverduePaymentAlert(phoneNumber, studentName, amount, daysPastDue) {
    const message = `🔴 Mensalidade em Atraso\n\nA mensalidade do aluno ${studentName} está em atraso há ${daysPastDue} dias.\n\nValor: R$ ${amount}\n\nPor favor, entre em contato para regularizar a situação.`;

    return await this.sendMessage(phoneNumber, message);
  }

  async sendIncidentNotification(phoneNumber, studentName, incidentType, description, date) {
    const message = `📋 Notificação de Ocorrência\n\nAluno: ${studentName}\nTipo: ${incidentType}\nData: ${date}\n\nDescrição: ${description}\n\nPara mais informações, entre em contato com a escola.`;

    return await this.sendMessage(phoneNumber, message);
  }

  async sendGeneralNotification(phoneNumber, title, message) {
    const fullMessage = `📢 ${title}\n\n${message}`;
    return await this.sendMessage(phoneNumber, fullMessage);
  }

  // Webhook para receber mensagens
  async handleWebhook(body) {
    try {
      if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
          entry.changes.forEach(change => {
            if (change.field === 'messages') {
              const messages = change.value.messages;
              if (messages) {
                messages.forEach(message => {
                  console.log('Mensagem recebida:', message);
                  // Aqui você pode implementar lógica para responder automaticamente
                  // ou salvar a mensagem no banco de dados
                });
              }
            }
          });
        });
      }
      return { status: 'success' };
    } catch (error) {
      console.error('Erro no webhook WhatsApp:', error);
      throw error;
    }
  }
}

export default new WhatsAppService();
