// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const MessageHandler = require('./messageHandler');

const app = express();
const port = 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  }
});

const messageHandler = new MessageHandler(client);

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  await messageHandler.handleMessage(message);
});

client.initialize();

app.get('/', (req, res) => {
  res.send('Chatbot is running');
});

app.listen(port, () => {
  console.log(`Chatbot listening on port ${port}`);
});
