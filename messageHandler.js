// messageHandler.js
const userStateManager = require('./userStatesManager');
const conversationHandlersMain = require('./conversationHandlers/conversationHandlers_main');
const conversationHandlersService1 = require('./conversationHandlers/conversationHandlers_service1');
const conversationHandlersService2 = require('./conversationHandlers/conversationHandlers_service2');
const conversationHandlersService3 = require('./conversationHandlers/conversationHandlers_service3');
const conversationHandlersService4 = require('./conversationHandlers/conversationHandlers_service4');
const conversationHandlersService5 = require('./conversationHandlers/conversationHandlers_service5');
const fs = require('fs');

const messagesFile = 'messages.json';

class MessageHandler {
  constructor(client) {
    this.client = client;
    this.messages = this.loadMessages();
  }

  loadMessages() {
    try {
      const data = fs.readFileSync(messagesFile);
      return JSON.parse(data);
    } catch (error) {
      console.log('No se encontró el archivo messages.json, se creará uno nuevo.');
      return [];
    }
  }

  saveMessages() {
    fs.writeFileSync(messagesFile, JSON.stringify(this.messages, null, 2));
  }

  async handleMessage(message) {
    const userId = message.from;
    const userMessage = message.body;

    userStateManager.initializeUser(userId);
    const userState = userStateManager.getUserState(userId);

    try {
      if (userMessage.startsWith("Hola, quiero información de Renting gracias")) {
        // Si el mensaje es el de inicio, siempre se maneja
        await conversationHandlersMain.handleInterest(message, userId);
      } else if (userState) {
        // Si el usuario tiene un estado
        if (userState.state === 'initial') {
          // Si el usuario está en estado initial y el mensaje NO es el de inicio, no hacemos nada
          return;
        }
        // Si el usuario no esta en estado initial, se hace el switch
        switch (userState.state) {
          case 'main_menu':
            await conversationHandlersMain.handleMainMenuSelection(message, userId);
            break;
          case 'name_input':
            await conversationHandlersMain.handleNameInput(message, userId);
            break;
          case 'service_menu':
            const service = userMessage; // Aqui se obtiene el numero del servicio
            userStateManager.updateUserData(userId, { service }); // Se guarda el numero del servicio
            switch (service) {
              case '1':
                await conversationHandlersService1.handleServiceMenuSelection(message, userId);
                break;
              case '2':
                await conversationHandlersService2.handleServiceMenuSelection(message, userId);
                break;
              case '3':
                await conversationHandlersService3.handleServiceMenuSelection(message, userId);
                break;
              case '4':
                await conversationHandlersService4.handleServiceMenuSelection(message, userId);
                break;
              case '5':
                await conversationHandlersService5.handleServiceMenuSelection(message, userId);
                break;
              default:
                userStateManager.updateUserState(userId, "initial");
                await message.reply(
                  `❌ *No comprendo tu mensaje.* \n\n` +
                  `Vamos a empezar de nuevo.\n\n` +
                  `Si deseas volver a iniciar la conversación, escribe *Hola, quiero información de Renting gracias.*`
                );
                break;
            }
            break;
          case 'person_type_service1':
            await conversationHandlersService1.handlePersonTypeSelection(message, userId);
            break;
          case 'payment_method':
            await conversationHandlersService1.handlePaymentMethodSelection(message, userId);
            break;
          case 'schedule_contact':
            await conversationHandlersService1.handleScheduleContactSelection(message, userId);
            break;
          case 'person_type_service2':
            await conversationHandlersService2.handlePersonTypeSelection(message, userId);
            break;
          case 'data_credit_natural':
            await conversationHandlersService2.handleDataCreditNaturalSelection(message, userId);
            break;
          case 'data_credit_juridica':
            await conversationHandlersService2.handleDataCreditJuridicaSelection(message, userId);
            break;
          case 'job_type':
            await conversationHandlersService2.handleJobTypeSelection(message, userId);
            break;
          case 'asset_type':
            await conversationHandlersService3.handleAssetTypeSelection(message, userId);
            break;
          case 'company_age':
            await conversationHandlersService3.handleCompanyAgeSelection(message, userId);
            break;
          case 'sales_average':
            await conversationHandlersService3.handleSalesAverageSelection(message, userId);
            break;
          case 'technology_options':
            await conversationHandlersService3.handleTechnologyOptionsSelection(message, userId);
            break;
          case 'person_type_long_term':
            await conversationHandlersService4.handlePersonTypeLongTermSelection(message, userId);
            break;
          case 'data_credit_natural_long_term':
            await conversationHandlersService4.handleDataCreditNaturalLongTermSelection(message, userId);
            break;
          case 'monthly_income_long_term':
            await conversationHandlersService4.handleMonthlyIncomeLongTermSelection(message, userId);
            break;
          case 'company_time_long_term':
            await conversationHandlersService4.handleCompanyTimeLongTermSelection(message, userId);
            break;
          case 'vehicle_type_long_term':
            await conversationHandlersService4.handleVehicleTypeLongTermSelection(message, userId);
            break;
          case 'company_age_service5':
            await conversationHandlersService5.handleCompanyAgeSelection(message, userId);
            break;
          case 'sales_average_service5':
            await conversationHandlersService5.handleSalesAverageSelection(message, userId);
            break;
          default:
            userStateManager.updateUserState(userId, "initial");
            await message.reply(
              `❌ *No comprendo tu mensaje.* \n\n` +
              `Vamos a empezar de nuevo.\n\n` +
              `Si deseas volver a iniciar la conversación, escribe *Hola, quiero información de Renting gracias.*`
            );
            break;
        }
      }
      // Marcar el mensaje como procesado
      this.messages.push({ userId, message: userMessage, processed: true });
      this.saveMessages();
    } catch (error) {
      console.error("Error al manejar el mensaje:", error);
      await message.reply(
        `❌ *Ocurrió un error al procesar tu mensaje.* \n\n` +
        `Por favor, intenta de nuevo.`
      );
    }
  }
}

module.exports = MessageHandler;
