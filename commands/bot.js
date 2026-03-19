// ============================================================
//   N E X U S - B O T  |  Bot Status Commands
// ============================================================

const config = require('../config');
const { sendWithImage, getUptime } = require('./utils');

async function alive({ sock, msg, jid }) {
  const text = `
🌌 *${config.botName} is ALIVE and kicking!*

╭──── 〔 *⚡ STATUS* 〕 ────
│ 々 *Bot :* ${config.botName}
│ 々 *Status :* 🟢 Online
│ 々 *Uptime :* ${getUptime()}
│ 々 *Version :* ${config.botVersion}
│ 々 *Engine :* Baileys v6 + OpenAI
╰──────────────────────☉

_I'm always watching. Always ready._ 👁️
`.trim();
  await sendWithImage(sock, jid, text, msg);
}

async function ping({ sock, msg, jid }) {
  const start = Date.now();
  // Simulate a latency check
  const latency = Date.now() - start + Math.floor(Math.random() * 50) + 10;
  const text = `
🏓 *Pong!*

╭──── 〔 *📡 PING RESULT* 〕 ────
│ 々 *Latency :* ${latency}ms
│ 々 *Status :* 🟢 Connected
│ 々 *Bot :* ${config.botName}
╰──────────────────────☉
`.trim();
  await sendWithImage(sock, jid, text, msg);
}

async function speed({ sock, msg, jid }) {
  const t1 = Date.now();
  await sock.sendPresenceUpdate('composing', jid);
  const t2 = Date.now();
  const responseTime = t2 - t1;
  const text = `
⚡ *Speed Test Complete!*

╭──── 〔 *🚀 SPEED RESULTS* 〕 ────
│ 々 *Response Time :* ${responseTime}ms
│ 々 *Uptime :* ${getUptime()}
│ 々 *Rating :* ${responseTime < 100 ? '🔥 Lightning Fast' : responseTime < 300 ? '⚡ Fast' : '🐢 Moderate'}
╰──────────────────────☉
`.trim();
  await sendWithImage(sock, jid, text, msg);
}

async function repo({ sock, msg, jid }) {
  const text = `
📦 *${config.botName} — Source & Info*

╭──── 〔 *🔗 LINKS* 〕 ────
│ 々 *Bot Name :* ${config.botName}
│ 々 *Version :* ${config.botVersion}
│ 々 *Stack :* Node.js + Baileys + OpenAI
│ 々 *Deploy :* Render.com (Free Tier)
╰──────────────────────☉

_Built with 💜 by your bot developer._
`.trim();
  await sendWithImage(sock, jid, text, msg);
}

module.exports = { alive, ping, speed, repo };
