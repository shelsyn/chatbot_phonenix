// conversationHandlers/conversationHandlers_service3.js
const userStateManager = require('../userStatesManager');

class ConversationHandlersService3 {
  constructor(client) {
    this.client = client;
  }

  async handleServiceMenuSelection(message, userId) {
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'asset_type');
    await message.reply(
      `👤 Sr. *${userName}*, Recuerde que la renta de activos productos es unicamente para empresas, es basicamente un contrato que le permite a su compañia el uso de ACTIVOS durante un plazo determinado, sin la obligación de comprarlos , facilitando el proceso de renovación total.\n\n` +
      `¿En qué activo se encuentra interesado?\n\n` +
      `*1.* _Maquinaria industrial_\n` +
      `*2.* _Equipos medicos_\n` +
      `*3.* _Maquinaria amarilla_\n` +
      `*4.* _Aires acondicionados y refrigeración_\n` +
      `*5.* _Tecnología y Activos a la medida_\n` +
      `*6.* _Mobiliario y estanteria_`
    );
  }

  async handleAssetTypeSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserData(userId, { asset: userSelection });
    switch (userSelection) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '6':
        userStateManager.updateUserState(userId, 'company_age');
        await message.reply(`Sr. *${userName}*, ¿su empresa tiene 3 o mas años de antigüedad?\n\n*Escribe:*\n*SI* - Si tiene 3 o mas años\n*NO* - Si no tiene 3 o mas años`);
        break;
      case '5':
        userStateManager.updateUserState(userId, 'technology_options');
        await message.reply(
          `Sr. *${userName}*, ¿en cuál de las siguientes opciones estás interesado?\n\n` +
          `*1.* _Computadores para empresa_\n` +
          `*2.* _Tablets_\n` +
          `*3.* _Celulares_\n` +
          `*4.* _Otros_`
        );
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida del menú.* ");
        break;
    }
  }

  async handleCompanyAgeSelection(message, userId) {
    const userSelection = message.body.trim().toUpperCase();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case 'SI':
        userStateManager.updateUserState(userId, 'sales_average');
        await message.reply(`Sr. *${userName}*, ¿su promedio de ventas es mayor o igual a 5 mil millones anuales?\n\n*Escribe:*\n*SI* - Si es mayor o igual\n*NO* - Si no es mayor o igual`);
        break;
      case 'NO':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al nivel de ingresos mínimo permitido.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`+
        `Si deseas volver a iniciar la conversación, escribe *Hola, quiero información de Renting gracias*`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*Escribe:*\n*SI* - Si tiene 3 o mas años\n*NO* - Si no tiene 3 o mas años");
        break;
    }
  }

  async handleSalesAverageSelection(message, userId) {
    const userSelection = message.body.trim().toUpperCase();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case 'SI':
        userStateManager.updateUserState(userId, 'schedule_contact');
        await message.reply(`🗓️ Un especialista se comunicará con usted para poder procesar su solicitud.\n\n¿En qué día y hora desea que el especialista se comunique con usted?`);
        break;
      case 'NO':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al nivel de ingresos mínimo permitido.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`+
        `Si deseas volver a iniciar la conversación, escribe *Hola, quiero información de Renting gracias*`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*Escribe:*\n*SI* - Si es mayor o igual\n*NO* - Si no es mayor o igual");
        break;
    }
  }

  async handleTechnologyOptionsSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case '1':
      case '2':
      case '3':
      case '4':
        userStateManager.updateUserState(userId, 'schedule_contact');
        await message.reply(`🗓️ Un especialista se comunicará con usted para poder procesar su solicitud.\n\n¿En qué día y hora desea que el especialista se comunique con usted?`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*1.* _Computadores para empresa_\n*2.* _Tablets_\n*3.* _Celulares_\n*4.* _Otros_");
        break;
    }
  }

  async handleScheduleContactSelection(message, userId) {
    const schedule = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'initial');
    await message.reply(`🗓️ El día *${schedule}* nuestro especialista estará en contacto con usted. 🤝\n\n*Muchas gracias por su atención.*`);
  }

  async handleInvalidOption(message, customMessage = "❌ *Por favor, selecciona una opción válida del menú.* ") {
    await message.reply(customMessage);
  }
}

module.exports = new ConversationHandlersService3();
