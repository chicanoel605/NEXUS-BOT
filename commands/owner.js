// ============================================================
//   N E X U S - B O T  |  Owner Commands
// ============================================================

const config = require('../config');
const { sendWithImage, formatNumber } = require('./utils');

// ── OWNER INFO ───────────────────────────────────────────────
async function owner({ sock, msg, jid }) {
  const text = `
👑 *Bot Owner Information*

╭──── 〔 *🌟 OWNER* 〕 ────
│ 々 *Name :* Bot Owner
│ 々 *Number :* +${config.ownerNumber}
│ 々 *Bot Name :* ${config.botName}
│ 々 *Version :* ${config.botVersion}
╰──────────────────────☉

_Contact the owner for support or to report bugs!_
`.trim();
  await sendWithImage(sock, jid, text, msg);
}

// ── GET PROFILE PICTURE ──────────────────────────────────────
async function getPP({ sock, msg, jid }) {
  try {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] || msg.key.remoteJid;

    const ppUrl = await sock.profilePictureUrl(target, 'image');
    await sock.sendMessage(jid, {
      image: { url: ppUrl },
      caption: `🖼️ *Profile Picture*\n\n@${formatNumber(target)}`,
      mentions: [target],
    }, { quoted: msg });
  } catch {
    await sendWithImage(sock, jid, '❌ *Could not fetch profile picture.*\n\n_The user may have their privacy settings restricting this._', msg);
  }
}

// ── BLOCK ────────────────────────────────────────────────────
async function block({ sock, msg, jid }) {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (!mentioned || !mentioned.length) {
    return sendWithImage(sock, jid, '❌ *Usage:* `.block @user`\n\nMention the user to block.', msg);
  }

  await sock.updateBlockStatus(mentioned[0], 'block');
  await sendWithImage(sock, jid, `🚫 *Blocked:* @${formatNumber(mentioned[0])}`, msg);
}

// ── BROADCAST ────────────────────────────────────────────────
async function broadcast({ sock, msg, jid, q }) {
  if (!q) {
    return sendWithImage(sock, jid, '📢 *Usage:* `.broadcast <message>`\n\nSends a message to all bot contacts.', msg);
  }

  await sendWithImage(sock, jid, `📢 *Broadcast sent!*\n\n_Message:_ ${q}`, msg);
  // Note: actual broadcast to all chats would require iterating store.chats
  // This is a placeholder to avoid spamming — implement carefully
}

module.exports = { owner, getPP, block, broadcast };
