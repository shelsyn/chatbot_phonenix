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
    switch (currentState) {
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
      case 'contact_time':
        await handleContactTimeSelection(message, userId);
        break;
      case 'schedule_time':
        await handleScheduleTime(message, userId);
        break;
      case 'juridica':
        await handleJuridicaTime(message, userId);
        break;
      case 'contact_time_juridica':
        await handleContactTimeJuridica(message, userId);
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
  userStates.set(userId, 'main_menu');
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
      userStates.set(userId, 'name_input');
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
  userStates.set(userId, 'persona_type'); // Cambiar el estado a persona_type
  await message.reply(`¡Gracias, ${userName}! Sabía usted que el renting de vehículos es un servicio de alquiler a largo plazo que permite a los usuarios disponer de un vehículo por un período determinado, a cambio de un canon de arrendamiento mensual. Nosotros nos encargaremos de los gastos asociados al vehículo, como el mantenimiento, el seguro y los impuestos, lo que hace que el renting sea una opción más conveniente y económica que la compra de un vehículo propio, gracias a sus beneficios tributarios.`);
  await message.reply(
    `Sr ${userName}, ¿qué tipo de persona es usted?\n` +
    "1 - Natural\n" +
    "2 - Jurídica\n"
  );
}

// Selección de tipo de persona (Natural o Jurídica)
async function handlePersonaTypeSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      userStates.set(userId, 'data_credit');
      await message.reply(
        "Para continuar con nuestro proceso, por favor responda las siguientes preguntas:\n" +
        "¿Está usted reportado en Data crédito?\n" +
        "1 - *NO*\n" +
        "2 - *SI*\n"
      );
      break;
    case '2':
      userStates.set(userId, 'juridica'); // Cambiar el estado a juridica para personas juridicas
      await message.reply(
        "¿Cuánto tiempo tiene de constituida su empresa?\n" +
        "1 - De 1 a 12 meses\n" +
        "2 - De 12 a 24 meses\n" +
        "3 - Más de 24 meses\n"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Natural\n2 - Jurídica");
      break;
  }
}

// Manejo de selección sobre reporte en Data Crédito
async function handleDataCreditSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      userStates.set(userId, 'income_verification');
      await message.reply(
        "Sus ingresos mensuales son superiores a $4'000.000?\n" +
        "1 - *SI*\n" +
        "2 - *NO*\n"
      );
      break;
    case '2':
      await message.reply("Lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al reporte financiero no positivo. Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\nSi deseas volver a iniciar la conversación, escriba *Hola, quiero información de Renting gracias*");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - SI\n2 - NO");
      break;
  }
}

// Verificación de ingresos mensuales
async function handleIncomeVerificationSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      userStates.set(userId, 'contact_time');
      await message.reply(
        "¿Qué desea hacer?\n" +
        "1 - Que se comunique de inmediato.\n" +
        "2 - Que se comuniquen en otro horario."
      );
      break;
    case '2':
      await message.reply("Lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al nivel de ingresos mínimo permitido. Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.\n\n");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - SI\n2 - NO");
      break;
  }
}

// Selección de horario de contacto
async function handleContactTimeSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      await message.reply("El especialista se contactará lo más pronto posible con usted.\n\n");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '2':
      await message.reply("¿En qué horario desea que el especialista en arrendamiento se comunique con usted?\n *Ejemplo: Desde la 1pm hasta las 5pm*");
      userStates.set(userId, 'schedule_time'); // Cambiar el estado para manejar el horario de contacto
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Que se comunique de inmediato.\n2 - Que se comuniquen en otro horario.");
      break;
  }
}

// Selección de horario específico de contacto
async function handleScheduleTime(message, userId) {
  const scheduleTime = message.body.trim();
  await message.reply(`Gracias! El especialista se comunicará con usted en el horario solicitado. Buen día!\n\n`);
  userStates.delete(userId); // Reiniciar el estado después de manejar la selección
}

// Manejo de selección sobre tiempo constituido de la empresa para personas jurídicas
async function handleJuridicaTime(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
    case '2':
    case '3':
      userStates.set(userId, 'contact_time_juridica');
      await message.reply(
        "¿Qué desea hacer?\n" +
        "1 - Que se comunique de inmediato.\n" +
        "2 - Que se comuniquen en otro horario.\n\n" +
        "Si deseas volver a iniciar la conversación, escriba *Hola, quiero información de Renting gracias.*"
      );
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - De 1 a 12 meses\n2 - De 12 a 24 meses\n3 - Más de 24 meses");
      break;
  }
}

// Selección de horario de contacto para personas jurídicas
async function handleContactTimeJuridica(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      await message.reply("El especialista se contactará lo más pronto posible con usted.\n\n");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '2':
      await message.reply("¿En qué horario desea que el especialista en arrendamiento se comunique con usted?\n *Ejemplo: Desde la 1pm hasta las 5pm*");
      userStates.set(userId, 'schedule_time'); // Cambiar el estado para manejar el horario de contacto
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Que se comunique de inmediato.\n2 - Que se comuniquen en otro horario.");
      break;
  }
}

// Iniciar cliente de WhatsApp solo después de definir los eventos
client.initialize();

