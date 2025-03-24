// conversationHandlers/conversationHandlers_service2.js
const userStateManager = require('../userStatesManager');

class ConversationHandlersService2 {
  constructor(client) {
    this.client = client;
  }

  async handleServiceMenuSelection(message, userId) {
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'person_type_service2');
    await message.reply(
      `👤 Señor *${userName}* que tipo de persona es usted:\n\n` +
      `*1.* _Persona Natural_\n` +
      `*2.* _Persona Jurídica_`
    );
  }

  async handlePersonTypeSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case '1':
        userStateManager.updateUserState(userId, 'data_credit_natural');
        await message.reply(
          `Sr. *${userName}* para continuar con nuestro proceso por favor responda las siguientes preguntas:\n\n` +
          `¿Está usted reportado en Data crédito?\n\n` +
          `*Escribe:*\n` +
          `*SI* - Si estas reportado\n` +
          `*NO* - Si no estas reportado`
        );
        break;
      case '2':
        userStateManager.updateUserState(userId, 'data_credit_juridica');
        await message.reply(
          `Sr. *${userName}* para continuar con nuestro proceso por favor responda las siguientes preguntas:\n\n` +
          `¿Está su empresa reportada en Data crédito?\n\n` +
          `*Escribe:*\n` +
          `*SI* - Si esta reportada\n` +
          `*NO* - Si no esta reportada`
        );
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*1.* _Persona Natural_\n*2.* _Persona Jurídica_");
        break;
    }
  }

  async handleDataCreditNaturalSelection(message, userId) {
    const userSelection = message.body.trim().toUpperCase();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case 'SI':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido a su reporte en DataCrédito.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`);
        break;
      case 'NO':
        userStateManager.updateUserState(userId, 'job_type');
        await message.reply(
          `Sr. *${userName}* Actualmente su tipo de trabajo es:\n\n` +
          `*1.* _Empleado_\n` +
          `*2.* _Independiente_\n` +
          `*3.* _Rentista de capital_\n` +
          `*4.* _Militar_`
        );
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*Escribe:*\n*SI* - Si estas reportado\n*NO* - Si no estas reportado");
        break;
    }
  }

  async handleDataCreditJuridicaSelection(message, userId) {
    const userSelection = message.body.trim().toUpperCase();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case 'SI':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al reporte de su empresa en DataCrédito.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso.\n\n`);
        break;
      case 'NO':
        userStateManager.updateUserState(userId, 'schedule_contact');
        await message.reply(`🗓️ Un especialista se comunicará con usted para poder procesar su solicitud.\n\n¿En qué día y hora desea que el especialista se comunique con usted?`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*Escribe:*\n*SI* - Si esta reportada\n*NO* - Si no esta reportada");
        break;
    }
  }

  async handleJobTypeSelection(message, userId) {
    userStateManager.updateUserState(userId, 'schedule_contact');
    await message.reply(`🗓️ Un especialista se comunicará con usted para poder procesar su solicitud.\n\n¿En qué día y hora desea que el especialista se comunique con usted?`);
  }

  async handleScheduleContactSelection(message, userId) {
    const schedule = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'initial');
    await message.reply(`🗓️ El día *${schedule}* nuestro especialista estará en contacto con usted. 🤝\n\n*Muchas gracias por su atención.*`);
  }

  async handleInvalidOption(message, customMessage = "❌ *Por favor, selecciona una opción válida.* ") {
    await message.reply(customMessage);
  }
}

module.exports = new ConversationHandlersService2();
