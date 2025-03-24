// conversationHandlers/conversationHandlers_main.js
const userStateManager = require('../userStatesManager');

class ConversationHandlersMain {
  constructor(client) {
    this.client = client;
  }

  async handleInterest(message, userId) {
    userStateManager.updateUserState(userId, 'main_menu');
    await message.reply(
      `*¡Hola, bienvenido a VentaRentall!* 👋\n\n` +
      `Somos distribuidores de diferentes marcas y nos especializamos en la *venta* y *renta* de activos productivos (más de un año).\n\n` +
      `Al utilizar este medio, aceptas los términos y condiciones de WhatsApp.\n\n` +
      `Para continuar con nuestra asesoría, debes aceptar nuestra política de tratamiento de datos personales, que puedes consultar aquí: https://ventrentall.com/terminos \n\n` +
      `*¿Aceptas nuestra política de tratamiento de datos?*\n\n` +
      `*Escribe:* \n` +
      `*SI* - Si aceptas\n` +
      `*NO* - Si no aceptas`
    );
  }

  async handleMainMenuSelection(message, userId) {
    const userSelection = message.body.trim().toUpperCase();
    switch (userSelection) {
      case 'SI':
        userStateManager.updateUserState(userId, 'name_input');
        await message.reply("😊 ¡Hola! Entiendo que estás interesado(a) en conocer nuestros servicios. Dime, ¿cuál es tu *nombre completo*?");
        break;
      case 'NO':
        userStateManager.updateUserState(userId, 'initial');
        await message.reply("😔 Gracias por tu tiempo. Si en algún momento deseas conocer más sobre VentaRentall, escribe *Hola, quiero información de Renting gracias*.");
        break;
      default:
        await this.handleInvalidOption(message);
        break;
    }
  }

  async handleNameInput(message, userId) {
    const userName = message.body.trim();
    userStateManager.updateUserState(userId, 'service_menu');
    userStateManager.updateUserData(userId, { userName });
    await message.reply(
      ` 👤 Sr. *${userName}*, por favor, selecciona el número del servicio en el que estás interesado(a):\n\n` +
      `*1.* _Compra de vehículo nuevo_\n` +
      `*2.* _Gestionar crédito vehicular_\n` +
      `*3.* _Renta de activos productivos_\n` +
      `*4.* _Renta de vehículos a largo plazo (+ de 2 años)_\n` +
      `*5.* _Crédito para tu empresa_`
    );
  }

  async handleInvalidOption(message, customMessage = "❌ *Por favor, selecciona una opción válida del menú.* \n\n*Escribe:* \n*SI* - Si aceptas\n*NO* - Si no aceptas") {
    await message.reply(customMessage);
  }
}

module.exports = new ConversationHandlersMain();
