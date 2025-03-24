// conversationHandlers/conversationHandlers_service1.js
const userStateManager = require('../userStatesManager');

class ConversationHandlersService1 {
  constructor(client) {
    this.client = client;
  }

  async handleServiceMenuSelection(message, userId) {
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'person_type_service1');
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
      case '2':
        userStateManager.updateUserState(userId, 'payment_method');
        await message.reply(
          `Sr. *${userName}*, El vehículo que quiere comprar lo va a realizar:\n\n` +
          `*1.* _Con crédito vehicular_\n` +
          `*2.* _De contado_`
        );
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*1.* _Persona Natural_\n*2.* _Persona Jurídica_");
        break;
    }
  }

  async handlePaymentMethodSelection(message, userId) {
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

module.exports = new ConversationHandlersService1();
