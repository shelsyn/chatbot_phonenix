const http = require('http');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola, mundo!\n');
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

// Configuración del cliente de WhatsApp
const client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }) // Asegura que la ruta es persistente en Render
});

// Generar QR para conexión
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Conexión establecida correctamente');
});

// Map para manejar el estado de los usuarios
const userStates = new Map();

// Iniciar cliente de WhatsApp solo si se recibe el mensaje específico
client.on('message', async (message) => {
  const userId = message.from;
  const currentState = userStates.get(userId);

  if (message.body.startsWith("Hola, quiero información de Renting gracias")) {
    await handleInterest(message, userId);
  } else if (currentState) {
    // Procesar según el estado actual
    switch (currentState.state) {
      case 'main_menu':
        await handleMainMenuSelection(message, userId);
        break;
      case 'name_input':
        await handleNameInput(message, userId);
        break;
      case 'persona_type':
        await handlePersonaTypeSelection(message, userId);
        break;
      case 'data_credit':
        await handleDataCreditSelection(message, userId);
        break;
      case 'income_verification':
        await handleIncomeVerificationSelection(message, userId);
        break;
      case 'contact_time_natural':
        await handleContactTimeNatural(message, userId);
        break;
      case 'schedule_time_natural':
        await handleScheduleTimeNatural(message, userId);
        break;
      case 'time_constituted_juridica':
        await handleTimeConstitutedJuridica(message, userId);
        break;
      case 'vehicle_interest_juridica':
        await handleVehicleInterestJuridica(message, userId);
        break;
      case 'contact_time_juridica':
        await handleContactTimeJuridica(message, userId);
        break;
      case 'schedule_time_juridica':
        await handleScheduleTimeJuridica(message, userId);
        break;
      default:
        // Estado no reconocido, reiniciar
        userStates.delete(userId);
        await message.reply("No comprendo tu mensaje. Vamos a empezar de nuevo.\n\nSi deseas volver a iniciar la conversación, escriba *Hola, quiero información de Renting gracias.*");
        break;
    }
  }
});

// Función de manejo inicial del interés en renting
async function handleInterest(message, userId) {
  userStates.set(userId, { state: 'main_menu', previousState: null });
  await message.reply(
    "Hola, bienvenido a Phoenix Car, distribuidores autorizados de Mobilize Renting. Rentamos vehículos a largo plazo (más de un año). Al usar este medio, aceptas los términos y condiciones de WhatsApp. Para continuar con nuestra asesoría, debes aceptar nuestra política de tratamiento de datos personales que puedes consultar en https://acortar.link/PfUDnS. Si la aceptas, escribe *Si*, o en caso contrario, *No*.\n" +
    "*Si*\n" +
    "*No*\n"
  );
}

// Manejo de selección del menú principal
async function handleMainMenuSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case 'Si':
      userStates.set(userId, { state: 'name_input', previousState: 'main_menu' });
      await message.reply("Hola! Entiendo que estás interesado en conocer nuestra figura y servicios. ¿Dime cuál es tu nombre?");
      break;
    case 'No':
      await message.reply("Hola! Entiendo que *NO* estás de acuerdo con nuestras políticas de tratamiento de datos. Si cambias de opinión, acá estaremos para servirte!\n\nSi deseas volver a iniciar la conversación, escriba *Hola, quiero información de Renting gracias.*");
      userStates.delete(userId);
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida del menú.");
      break;
  }
}

// Función auxiliar para manejar el nombre de usuario
async function handleNameInput(message, userId) {
  const userName = message.body.trim();
  userStates.set(userId, { state: 'persona_type', previousState: 'name_input', userName });
  await message.reply(`¡Gracias, ${userName}! Sabía usted que el renting de vehículos es un servicio de alquiler a largo plazo que permite a los usuarios disponer de un vehículo por un período determinado, a cambio de un canon de arrendamiento mensual. Nosotros nos encargaremos de los gastos asociados al vehículo, como el mantenimiento, el seguro y los impuestos, lo que hace que el renting sea una opción más conveniente y económica que la compra de un vehículo propio, gracias a sus beneficios tributarios.`);
  await message.reply(
    `Sr ${userName}, ¿qué tipo de persona es usted?\n` +
    "1 - Natural\n" +
    "2 - Jurídica\n" +
    "3 - Regresar a la opción anterior\n"
  );
}

// Selección de tipo de persona (Natural o Jurídica)
async function handlePersonaTypeSelection(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
      userStates.set(userId, { state: 'data_credit', previousState: 'persona_type', userName });
      await message.reply(
        `Sr ${userName}, para continuar con nuestro proceso por favor responda las siguientes preguntas:\n` +
        "¿Está usted reportado en Data crédito?\n" +
        "1 - *SI*\n" +
        "2 - *NO*\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    case '2':
      userStates.set(userId, { state: 'time_constituted_juridica', previousState: 'persona_type', userName });
      await message.reply(
        `Sr ${userName}, ¿cuánto tiempo tiene de constituida su empresa?\n` +
        "1 - De 1 a 12 meses\n" +
        "2 - De 12 a 24 meses\n" +
        "3 - Más de 24 meses\n" +
        "4 - Regresar a la opción anterior\n"
      );
      break;
    case '3':
      await handleInterest(message, userId);
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Natural\n2 - Jurídica\n3 - Regresar a la opción anterior");
      break;
  }
}

// Manejo de selección sobre reporte en Data Crédito
async function handleDataCreditSelection(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
      await message.reply(`Sr ${userName}, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al reporte financiero no positivo. Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\nSi deseas volver a iniciar la conversación, escriba *Hola, quiero información de Renting gracias*`);
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '2':
      userStates.set(userId, { state: 'income_verification', previousState: 'data_credit', userName });
      await message.reply(
        `Sr ${userName}, sus ingresos mensuales son superiores a $4'000.000?\n` +
        "1 - *SI*\n" +
        "2 - *NO*\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    case '3':
      userStates.set(userId, { state: 'persona_type', previousState: 'data_credit', userName });
      await message.reply(
        `Sr ${userName}, ¿qué tipo de persona es usted?\n` +
        "1 - Natural\n" +
        "2 - Jurídica\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - SI\n2 - NO\n3 - Regresar a la opción anterior");
      break;
  }
}

// Verificación de ingresos mensuales
async function handleIncomeVerificationSelection(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
      userStates.set(userId, { state: 'contact_time_natural', previousState: 'income_verification', userName });
      await message.reply(
        `A continuación un especialista en arrendamiento operacional de vehículos se comunicará con usted para poder procesar su solicitud:\n` +
        "1 - Que se comunique de inmediato\n" +
        "2 - Que se comuniquen conmigo en otro horario\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    case '2':
      await message.reply(`Sr ${userName}, lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido a que sus ingresos no cumplen con el requisito mínimo. Si cambia esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\nSi deseas volver a iniciar la conversación, escriba *Hola, quiero información de Renting gracias*`);
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '3':
      userStates.set(userId, { state: 'data_credit', previousState: 'income_verification', userName });
      await message.reply(
        `Sr ${userName}, para continuar con nuestro proceso por favor responda las siguientes preguntas:\n` +
        "¿Está usted reportado en Data crédito?\n" +
        "1 - *SI*\n" +
        "2 - *NO*\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - SI\n2 - NO\n3 - Regresar a la opción anterior");
      break;
  }
}

// Manejo del tiempo de contacto natural
async function handleContactTimeNatural(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
      await message.reply("El especialista llamará al cliente de inmediato.");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '2':
      userStates.set(userId, { state: 'schedule_time_natural', previousState: 'contact_time_natural', userName });
      await message.reply(
        `¿En qué horario desea que el especialista en arrendamiento se comunique con usted?\n` +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    case '3':
      userStates.set(userId, { state: 'income_verification', previousState: 'contact_time_natural', userName });
      await message.reply(
        `Sr ${userName}, sus ingresos mensuales son superiores a $4'000.000?\n` +
        "1 - *SI*\n" +
        "2 - *NO*\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Que se comunique de inmediato\n2 - Que se comuniquen conmigo en otro horario\n3 - Regresar a la opción anterior");
      break;
  }
}

// Manejo del horario de contacto natural
async function handleScheduleTimeNatural(message, userId) {
  const { userName } = userStates.get(userId);
  const contactTime = message.body.trim();
  await message.reply(`El especialista llamará al cliente de inmediato a la hora indicada (${contactTime}).`);
  userStates.delete(userId); // Reiniciar el estado después de manejar la selección
}

// Manejo del tiempo constituido para persona jurídica
async function handleTimeConstitutedJuridica(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
    case '2':
    case '3':
      userStates.set(userId, { state: 'vehicle_interest_juridica', previousState: 'time_constituted_juridica', userName });
      await message.reply(
        `Sr ${userName}, ¿en qué tipo de vehículo está interesado?\n` +
        "1 - Automóvil o SUV\n" +
        "2 - Pick up\n" +
        "3 - Van de carga o camiones\n" +
        "4 - Regresar a la opción anterior\n"
      );
      break;
    case '4':
      userStates.set(userId, { state: 'persona_type', previousState: 'time_constituted_juridica', userName });
      await message.reply(
        `Sr ${userName}, ¿qué tipo de persona es usted?\n` +
        "1 - Natural\n" +
        "2 - Jurídica\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - De 1 a 12 meses\n2 - De 12 a 24 meses\n3 - Más de 24 meses\n4 - Regresar a la opción anterior");
      break;
  }
}

// Manejo del interés en vehículo para persona jurídica
async function handleVehicleInterestJuridica(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
    case '2':
    case '3':
      userStates.set(userId, { state: 'contact_time_juridica', previousState: 'vehicle_interest_juridica', userName });
      await message.reply(
        `A continuación un especialista en arrendamiento operacional de vehículos se comunicará con usted para poder procesar su solicitud:\n` +
        "1 - Que se comunique de inmediato\n" +
        "2 - Que se comuniquen conmigo en otro horario\n" +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    case '4':
      userStates.set(userId, { state: 'time_constituted_juridica', previousState: 'vehicle_interest_juridica', userName });
      await message.reply(
        `Sr ${userName}, ¿cuánto tiempo tiene de constituida su empresa?\n` +
        "1 - De 1 a 12 meses\n" +
        "2 - De 12 a 24 meses\n" +
        "3 - Más de 24 meses\n" +
        "4 - Regresar a la opción anterior\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Automóvil o SUV\n2 - Pick up\n3 - Van de carga o camiones\n4 - Regresar a la opción anterior");
      break;
  }
}

// Manejo del tiempo de contacto para persona jurídica
async function handleContactTimeJuridica(message, userId) {
  const userSelection = message.body.trim();
  const { userName } = userStates.get(userId);
  switch (userSelection) {
    case '1':
      await message.reply("El especialista llamará al cliente de inmediato.");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '2':
      userStates.set(userId, { state: 'schedule_time_juridica', previousState: 'contact_time_juridica', userName });
      await message.reply(
        `¿En qué horario desea que el especialista en arrendamiento se comunique con usted?\n` +
        "3 - Regresar a la opción anterior\n"
      );
      break;
    case '3':
      userStates.set(userId, { state: 'vehicle_interest_juridica', previousState: 'contact_time_juridica', userName });
      await message.reply(
        `Sr ${userName}, ¿en qué tipo de vehículo está interesado?\n` +
        "1 - Automóvil o SUV\n" +
        "2 - Pick up\n" +
        "3 - Van de carga o camiones\n" +
        "4 - Regresar a la opción anterior\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Que se comunique de inmediato\n2 - Que se comuniquen conmigo en otro horario\n3 - Regresar a la opción anterior");
      break;
  }
}

// Manejo del horario de contacto para persona jurídica
async function handleScheduleTimeJuridica(message, userId) {
  const { userName } = userStates.get(userId);
  const contactTime = message.body.trim();
  await message.reply(`El especialista llamará al cliente de inmediato a la hora indicada (${contactTime}).`);
  userStates.delete(userId); // Reiniciar el estado después de manejar la selección
}

// Iniciar el cliente de WhatsApp
client.initialize();
