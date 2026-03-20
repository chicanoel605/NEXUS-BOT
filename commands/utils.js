// ============================================================
//   N E X U S - B O T  |  Utility Functions
// ============================================================

const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Get the bot's uptime as a formatted string
 */
function getUptime() {
  const ms = Date.now() - config.startTime;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ${s % 60}s`;
}

/**
 * Get the bot banner image as a buffer
 */
function getBannerImage() {
  const imagePath = path.resolve(config.botImage);
  if (fs.existsSync(imagePath)) {
    return fs.readFileSync(imagePath);
  }
  // Return a placeholder 1x1 transparent PNG if image not found
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
}

/**
 * Extract text body from a WhatsApp message
 */
function getMessageBody(msg) {
  const m = msg.message;
  return (
    m?.conversation ||
    m?.extendedTextMessage?.text ||
    m?.imageMessage?.caption ||
    m?.videoMessage?.caption ||
    m?.buttonsResponseMessage?.selectedButtonId ||
    m?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ''
  );
}

/**
 * Get sender JID
 */
function getSender(msg) {
  return msg.key.participant || msg.key.remoteJid;
}

/**
 * Check if message is from a group
 */
function isGroup(msg) {
  return msg.key.remoteJid.endsWith('@g.us');
}

/**
 * Format a phone number for display
 */
function formatNumber(jid) {
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '');
}

/**
 * Send a message with the bot image
 */
async function sendWithImage(sock, jid, caption, quotedMsg = null) {
  const imageBuffer = getBannerImage();
  const options = {
    image: imageBuffer,
    caption: caption,
    mimetype: 'image/jpeg',
  };
  if (quotedMsg) options.quoted = quotedMsg;

  return await sock.sendMessage(jid, options);
}

/**
 * React to a message with an emoji
 */
async function reactTo(sock, msg, emoji) {
  return await sock.sendMessage(msg.key.remoteJid, {
    react: { text: emoji, key: msg.key },
  });
}

module.exports = {
  getUptime,
  getBannerImage,
  getMessageBody,
  getSender,
  isGroup,
  formatNumber,
  sendWithImage,
  reactTo,
};
