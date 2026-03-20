// ============================================================
//   N E X U S - B O T  |  Group Commands
// ============================================================

const { sendWithImage } = require('./utils');
const config = require('../config');

// Helper: check if user is group admin
async function isAdmin(sock, jid, participantJid) {
  const groupMeta = await sock.groupMetadata(jid);
  const admins = groupMeta.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);
  return admins.includes(participantJid);
}

// Helper: check if bot is admin
async function botIsAdmin(sock, jid) {
  const botId = sock.user.id.replace(/:\d+/, '') + '@s.whatsapp.net';
  return isAdmin(sock, jid, botId);
}

// ── TAG ALL ──────────────────────────────────────────────────
async function tagAll({ sock, msg, jid, inGroup, q }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ This command only works in groups!', msg);

  const groupMeta = await sock.groupMetadata(jid);
  const members = groupMeta.participants;
  const mentions = members.map(m => m.id);
  const message = q || '📢 Attention everyone!';

  const tagText = `📢 *${message}*\n\n${members.map(m => `@${m.id.split('@')[0]}`).join(' ')}`;

  await sock.sendMessage(jid, {
    text: tagText,
    mentions,
  }, { quoted: msg });
}

// ── HIDE TAG ─────────────────────────────────────────────────
async function hideTag({ sock, msg, jid, inGroup, q }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ This command only works in groups!', msg);

  const groupMeta = await sock.groupMetadata(jid);
  const members = groupMeta.participants;
  const mentions = members.map(m => m.id);
  const message = q || '👀';

  await sock.sendMessage(jid, {
    text: message,
    mentions,
  }, { quoted: msg });
}

// ── KICK ─────────────────────────────────────────────────────
async function kick({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ This command only works in groups!', msg);
  if (!(await botIsAdmin(sock, jid))) {
    return sendWithImage(sock, jid, '❌ I need to be an admin to kick members!', msg);
  }
  if (!(await isAdmin(sock, jid, sender))) {
    return sendWithImage(sock, jid, '❌ Only group admins can use this command!', msg);
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (!mentioned || mentioned.length === 0) {
    return sendWithImage(sock, jid, '❌ *Usage:* `.kick @user`\n\nMention the user to kick.', msg);
  }

  await sock.groupParticipantsUpdate(jid, mentioned, 'remove');
  await sendWithImage(sock, jid, `✅ *Kicked:* @${mentioned[0].split('@')[0]}`, msg);
}

// ── ADD ──────────────────────────────────────────────────────
async function add({ sock, msg, jid, inGroup, q, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ This command only works in groups!', msg);
  if (!(await botIsAdmin(sock, jid))) {
    return sendWithImage(sock, jid, '❌ I need to be an admin to add members!', msg);
  }
  if (!(await isAdmin(sock, jid, sender))) {
    return sendWithImage(sock, jid, '❌ Only group admins can use this command!', msg);
  }
  if (!q) return sendWithImage(sock, jid, '❌ *Usage:* `.add <number>`\n\n_Example: `.add 2348012345678`_', msg);

  const number = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  await sock.groupParticipantsUpdate(jid, [number], 'add');
  await sendWithImage(sock, jid, `✅ *Added:* @${q.replace(/[^0-9]/g, '')}`, msg);
}

// ── PROMOTE ──────────────────────────────────────────────────
async function promote({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ This command only works in groups!', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can promote!', msg);

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (!mentioned || !mentioned.length) return sendWithImage(sock, jid, '❌ Mention the user to promote.', msg);

  await sock.groupParticipantsUpdate(jid, mentioned, 'promote');
  await sendWithImage(sock, jid, `⬆️ *Promoted to admin:* @${mentioned[0].split('@')[0]}`, msg);
}

// ── DEMOTE ───────────────────────────────────────────────────
async function demote({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ This command only works in groups!', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can demote!', msg);

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (!mentioned || !mentioned.length) return sendWithImage(sock, jid, '❌ Mention the user to demote.', msg);

  await sock.groupParticipantsUpdate(jid, mentioned, 'demote');
  await sendWithImage(sock, jid, `⬇️ *Demoted:* @${mentioned[0].split('@')[0]}`, msg);
}

// ── CLOSE GROUP ──────────────────────────────────────────────
async function closeGroup({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can do this!', msg);

  await sock.groupSettingUpdate(jid, 'announcement');
  await sendWithImage(sock, jid, '🔒 *Group closed!* Only admins can send messages now.', msg);
}

// ── OPEN GROUP ───────────────────────────────────────────────
async function openGroup({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can do this!', msg);

  await sock.groupSettingUpdate(jid, 'not_announcement');
  await sendWithImage(sock, jid, '🔓 *Group opened!* Everyone can send messages now.', msg);
}

// ── GROUP LINK ───────────────────────────────────────────────
async function groupLink({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin to get the link!', msg);

  const code = await sock.groupInviteCode(jid);
  await sendWithImage(sock, jid, `🔗 *Group Invite Link*\n\nhttps://chat.whatsapp.com/${code}`, msg);
}

// ── REVOKE LINK ──────────────────────────────────────────────
async function revoke({ sock, msg, jid, inGroup, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can revoke the link!', msg);

  await sock.groupRevokeInvite(jid);
  await sendWithImage(sock, jid, '♻️ *Group invite link has been revoked!* A new link has been generated.', msg);
}

// ── SET NAME ─────────────────────────────────────────────────
async function setName({ sock, msg, jid, inGroup, q, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!q) return sendWithImage(sock, jid, '❌ *Usage:* `.setname <new name>`', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can change the group name!', msg);

  await sock.groupUpdateSubject(jid, q);
  await sendWithImage(sock, jid, `✅ *Group name changed to:* ${q}`, msg);
}

// ── SET DESC ─────────────────────────────────────────────────
async function setDesc({ sock, msg, jid, inGroup, q, sender }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!q) return sendWithImage(sock, jid, '❌ *Usage:* `.setdesc <new description>`', msg);
  if (!(await botIsAdmin(sock, jid))) return sendWithImage(sock, jid, '❌ I need to be admin!', msg);
  if (!(await isAdmin(sock, jid, sender))) return sendWithImage(sock, jid, '❌ Only admins can change the description!', msg);

  await sock.groupUpdateDescription(jid, q);
  await sendWithImage(sock, jid, `✅ *Group description updated!*`, msg);
}

// ── GROUP INFO ───────────────────────────────────────────────
async function groupInfo({ sock, msg, jid, inGroup }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);

  const meta = await sock.groupMetadata(jid);
  const admins = meta.participants.filter(p => p.admin).length;

  const text = `
👥 *Group Information*

╭──── 〔 *📋 DETAILS* 〕 ────
│ 々 *Name :* ${meta.subject}
│ 々 *Members :* ${meta.participants.length}
│ 々 *Admins :* ${admins}
│ 々 *Created :* ${new Date(meta.creation * 1000).toDateString()}
│ 々 *Description :* ${meta.desc || 'No description'}
╰──────────────────────☉
`.trim();

  await sendWithImage(sock, jid, text, msg);
}

// ── LEAVE ────────────────────────────────────────────────────
async function leave({ sock, msg, jid, inGroup, isOwner }) {
  if (!inGroup) return sendWithImage(sock, jid, '❌ Groups only!', msg);
  if (!isOwner) return sendWithImage(sock, jid, '❌ Only the bot owner can make the bot leave!', msg);

  await sendWithImage(sock, jid, '👋 *Goodbye everyone! NexusBot is leaving the group.*', msg);
  await sock.groupLeave(jid);
}

module.exports = {
  tagAll, hideTag, kick, add, promote, demote,
  closeGroup, openGroup, groupLink, revoke,
  setName, setDesc, groupInfo, leave,
};
  
