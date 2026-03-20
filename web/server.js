// ============================================================
//   N E X U S - B O T  |  Pairing Web Server
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('../config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const logger = pino({ level: 'silent' });

// Serve the pairing HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── PAIRING CODE ENDPOINT ────────────────────────────────────
app.post('/api/pair', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  // Clean phone number
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number. Include country code.' });
  }

  try {
    const sessionPath = path.join(config.sessionFolder, `pair_${cleanPhone}`);
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      browser: ['NexusBot', 'Chrome', '120.0.0'],
    });

    sock.ev.on('creds.update', saveCreds);

    // Wait for socket to register
    await new Promise(resolve => setTimeout(resolve, 2000));

    const code = await sock.requestPairingCode(cleanPhone);
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

    // Clean up temp session
    setTimeout(() => {
      sock.end();
    }, 30000);

    return res.json({
      success: true,
      code: formattedCode,
      phone: cleanPhone,
    });
  } catch (err) {
    console.error('[Pairing Error]:', err.message);
    return res.status(500).json({
      error: 'Failed to generate pairing code. Please try again.',
      detail: err.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', bot: config.botName }));

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🌐 [NexusBot Web] Pairing server running on port ${PORT}`);
  console.log(`   → Local: http://localhost:${PORT}`);
});

module.exports = app;
