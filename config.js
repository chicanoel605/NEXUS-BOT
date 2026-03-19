require('dotenv').config();

module.exports = {
  botName: process.env.BOT_NAME || 'NexusBot',
  botVersion: process.env.BOT_VERSION || '1.0.0',
  prefix: process.env.PREFIX || '.',
  ownerNumber: process.env.OWNER_NUMBER || '',
  openaiKey: process.env.OPENAI_API_KEY || '',
  sessionFolder: process.env.SESSION_FOLDER || './session',
  port: parseInt(process.env.PORT) || 3000,
  botImage: './assets/banner.jpg',   // ← Place YOUR image here
  startTime: Date.now(),
};
