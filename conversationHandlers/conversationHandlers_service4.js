// conversationHandlers/conversationHandlers_service4.js
const userStateManager = require('../userStatesManager');

class ConversationHandlersService4 {
  constructor(client) {
    this.client = client;
  }

  async handleServiceMenuSelection(message, userId) {
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'person_type_long_term');
    await message.reply(
      `👤 Sr. *${userName}*, UNICAMENTE RENTAMOS A LARGO PLAZO MAS DE UN AÑO, sabia usted que manejamos renta de vehiculos  a largo plazo MAS DE 1 AÑO  que permite a los usuarios disponer de un vehículo por un período determinado, a cambio de un canon de arrendamiento mensual.\n\n` +
      `Nosotros nos encargaremos de los gastos asociados al vehículo, como el mantenimiento, el seguro y los impuestos, lo que hace que el renting sea una opción más conveniente y económica que la compra de un vehículo propio, gracias a sus beneficios tributarios.\n\n` +
      `Señor *${userName}* que tipo de persona es usted:\n\n` +
      `*1.* _Persona Natural_\n` +
      `*2.* _Persona Jurídica_`
    );
  }

  async handlePersonTypeLongTermSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserData(userId, { personType: userSelection });
    switch (userSelection) {
      case '1':
        userStateManager.updateUserState(userId, 'data_credit_natural_long_term');
        await message.reply(
          `Sr. *${userName}*, ¿Está usted reportado en Data crédito?\n\n` +
          `*Escribe:*\n` +
          `*SI* - Si estas reportado\n` +
          `*NO* - Si no estas reportado`
        );
        break;
      case '2':
        userStateManager.updateUserState(userId, 'company_time_long_term');
        await message.reply(
          `Sr. *${userName}* ¿cuanto tiempo tiene de constituida su empresa?\n\n` +
          `*1.* _12 a 24 meses_\n` +
          `*2.* _Más de 24 meses_`
        );
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*1.* _Persona Natural_\n*2.* _Persona Jurídica_");
        break;
    }
  }

  async handleDataCreditNaturalLongTermSelection(message, userId) {
    const userSelection = message.body.trim().toUpperCase();
    const { userName } = userStateManager.getUserState(userId).data;
    switch (userSelection) {
      case 'SI':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply(`😔 Sr. *${userName}*, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido a su reporte en DataCrédito.\n\n`+
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`);
        break;
      case 'NO':
        userStateManager.updateUserState(userId, 'monthly_income_long_term');
        await message.reply(
          `Sr. *${userName}* ¿Sus ingresos mensuales son mayores o iguales a 4.500.000?\n\n` +
          `*Escribe:*\n` +
          `*SI* - Si es mayor o igual\n` +
          `*NO* - Si no es mayor o igual`
        );
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*Escribe:*\n*SI* - Si estas reportado\n*NO* - Si no estas reportado");
        break;
    }
  }

  async handleMonthlyIncomeLongTermSelection(message, userId) {
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
        `Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n`);
        break;
      default:
        await this.handleInvalidOption(message, "❌ *Por favor, selecciona una opción válida:* \n\n*Escribe:*\n*SI* - Si es mayor o igual\n*NO* - Si no es mayor o igual");
        break;
    }
  }

  async handleCompanyTimeLongTermSelection(message, userId) {
    const userSelection = message.body.trim();
    const { userName } = userStateManager.getUserState(userId).data;
    userStateManager.updateUserState(userId, 'vehicle_type_long_term');
    await message.reply(
      `Sr. *${userName}* ¿En que tipo de vehículo esta interesado?\n\n` +
      `*1.* _Automóvil o SUV_\n` +
      `*2.* _Pick up_\n` +
      `*3.* _Van de carga o camiones_`
    );
  }

  async handleVehicleTypeLongTermSelection(message, userId) {
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

module.exports = new ConversationHandlersService4();
