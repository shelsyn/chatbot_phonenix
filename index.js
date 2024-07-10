const http = require('http');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const schedule = require('node-schedule');

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

// Manejar mensajes entrantes
client.on('message', async (message) => {
  const userId = message.from;
  const currentState = userStates.get(userId);

  if (message.body.startsWith("Hola, quiero información de Renting gracias.")) {
    await handleInterest(message, userId);
    return;
  }

  switch (currentState) {
    case undefined:
      userStates.set(userId, 'main_menu');
      await message.reply(
        "Hola bienvenido a Phoenix car distribuidores autorizados de mobilize renting, rentamos vehículos a largo plazo (mas de un año), al utilizar este medio aceptas términos y condiciones de WhatsApp; para continuar con nuestra asesoría debes aceptar la política de tratamiento de datos personales que puede ser consultada https://acortar.link/PfUDnS, si la aceptas digita SI, o en caso contrario digita NO. \n" +
        "*Si*\n" +
        "*No*\n"
      );
      break;
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
    default:
      let state = currentState;
      userStates.delete(userId);
      await message.reply(`Estabas en el estado: '${state}'. No comprendo tu selección. Vamos a empezar de nuevo.`);
      break;
  }
});

// Funciones de manejo de estados
async function handleMainMenuSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case 'Si':
      userStates.set(userId, 'name_input');
      await message.reply("Hola! Entiendo que estás interesado en conocer nuestra figura y servicios. ¿Dime cuál es tu nombre?");
      break;
    case 'No':
      await message.reply("Hola! Entiendo que *NO* estás de acuerdo con nuestras políticas de tratamiento de datos. Si cambias de opinión, acá estaremos para servirte!");
      userStates.delete(userId);
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida del menú.");
      break;
  }
}

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

async function handlePersonaTypeSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      userStates.set(userId, 'data_credit');
      await message.reply(
        "Para continuar con nuestro proceso por favor responda las siguientes preguntas: ¿Está usted reportado en Data crédito?\n" +
        "1 - *NO*\n" +
        "2 - *SI*\n"
      );
      break;
    case '2':
      await message.reply("Has seleccionado 'Jurídica'. Aquí tienes más información para personas jurídicas...");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Natural\n2 - Jurídica");
      break;
  }
}

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
      await message.reply("Lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al reporte financiero no positivo. Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - SI\n2 - NO");
      break;
  }
}

async function handleIncomeVerificationSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      userStates.set(userId, 'contact_time');
      await message.reply(
        "A continuación un especialista en arrendamiento operacional de vehículos se comunicará con usted para poder procesar su solicitud:\n" +
        "1 - Que se comunique de inmediato.\n" +
        "2 - Que se comuniquen en otro horario.\n"
      );
      break;
    case '2':
      await message.reply("Lamentamos informarle que por políticas internas de la compañía, no podemos procesar su solicitud debido al nivel de ingresos mínimo permitido. Tan pronto usted regule esta situación, podremos retomar el proceso de arrendamiento de vehículo.");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - SI\n2 - NO");
      break;
  }
}

async function handleContactTimeSelection(message, userId) {
  const userSelection = message.body.trim();
  switch (userSelection) {
    case '1':
      await message.reply("El especialista se contactará lo más pronto posible con usted.");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    case '2':
      await message.reply("¿En qué horario desea que el especialista en arrendamiento se comunique con usted?");
      userStates.delete(userId); // Reiniciar el estado después de manejar la selección
      break;
    default:
      await message.reply("Por favor, selecciona una opción válida:\n1 - Que se comunique de inmediato.\n2 - Que se comuniquen en otro horario.");
      break;
  }
}

async function handleInterest(message, userId) {
  const mensaje = message.body;
  const indiceDosPuntos = mensaje.indexOf(":");
  const textoExtraido = mensaje.slice(indiceDosPuntos + 2).trim();
  const elementos = textoExtraido.split(", ");
}

client.initialize();
