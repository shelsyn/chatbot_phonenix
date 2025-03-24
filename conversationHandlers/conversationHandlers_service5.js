// conversationHandlers/conversationHandlers_service5.js
const userStateManager = require('../userStatesManager');

class ConversationHandlersService5 {
  constructor(client) {
    this.client = client;
  }

  async handleServiceMenuSelection(message, userId) {
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'company_age_service5');
    await message.reply(
      `👤 Sr. *${userName}*, Ofrecemos soluciones financieras unicamente para empresas, ya sea que busques financiamiento para expansiones, inversiones o proyectos especificos.\n\n` +
      `¿Su empresa tiene una antiguedad mayor o igual a 5 años?\n\n` +
      `*1.* _SI_\n` +
      `*2.* _NO_`
    );
  }

  async handleCompanyAgeSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case '1':
        userStateManager.updateUserState(userId, 'sales_average_service5');
        await message.reply(
          `Sr. *${userName}*, ¿Su promedio de ventas es mayor o igual a los 5 mil millones anual?\n\n` +
          `*1.* _SI_\n` +
          `*2.* _NO_`
        );
        break;
      case '2':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al nivel de ingresos mínimo permitido.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*1.* _SI_\n*2.* _NO_");
        break;
    }
  }

  async handleSalesAverageSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case '1':
        userStateManager.updateUserState(userId, 'schedule_contact');
        await message.reply(`🗓️ Un especialista se comunicará con usted para poder procesar su solicitud.\n\n¿En qué día y hora desea que el especialista se comunique con usted?`);
        break;
      case '2':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al nivel de ingresos mínimo permitido.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*1.* _SI_\n*2.* _NO_");
        break;
    }
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

module.exports = new ConversationHandlersService5();
