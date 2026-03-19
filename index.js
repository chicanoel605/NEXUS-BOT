// ============================================================
//   N E X U S - B O T  |  Main Entry Point
//   Powered by @whiskeysockets/baileys
// ============================================================

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Load command handlers
const handleMessage = require('./commands/handler');

// Suppress noisy logs
const logger = pino({ level: 'silent' });

// In-memory store
const store = makeInMemoryStore({ logger });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: ['NexusBot', 'Chrome', '120.0.0'],
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return { conversation: 'hello' };
    },
  });

  store.bind(sock.ev);

  // Save credentials on update
  sock.ev.on('creds.update', saveCreds);

  // Connection handling
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n⚡ [NexusBot] QR Code received. Scan it or use the pairing website.\n');
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        `🔴 [NexusBot] Connection closed. Reconnecting: ${shouldReconnect}`
      );
      if (shouldReconnect) {
        setTimeout(startBot, 3000);
      }
    } else if (connection === 'open') {
      console.log('✅ [NexusBot] Connected successfully! Bot is now live.\n');
    }
  });

  // Message handling
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg?.message) return;
    if (msg.key.fromMe) return;  // Ignore own messages

    try {
      await handleMessage(sock, msg);
    } catch (err) {
      console.error('❌ [Handler Error]:', err.message);
    }
  });

  return sock;
}

// Start the bot
startBot().catch(console.error);

// Also start web server alongside
require('./web/server');
