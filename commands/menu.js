// ============================================================
//   N E X U S - B O T  |  Menu Command
// ============================================================

const config = require('../config');
const { sendWithImage, getUptime, formatNumber } = require('./utils');

async function menu({ sock, msg, jid, senderNumber }) {
  const uptime = getUptime();
  const user = `@${senderNumber}`;

  const menuText = `
🌌 *Hey ${user}, welcome to the command center!*

╭──── 〔 *𝗡𝗘𝗫𝗨𝗦-𝗕𝗢𝗧 𝗜𝗡𝗙𝗢* 〕 ────
│ 々 *Bot Name :* ${config.botName}
│ 々 *Version :* ${config.botVersion}
│ 々 *Prefix :* \`${config.prefix}\`
│ 々 *Uptime :* ${uptime}
│ 々 *Status :* Online ✅
╰──────────────────────☉

╭──── 〔 *🤖 𝗔𝗜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* 〕 ────
│ 々 \`${config.prefix}ai\` <question>
│ 々 \`${config.prefix}imagine\` <prompt>
│ 々 \`${config.prefix}roast\` <name/topic>
│ 々 \`${config.prefix}joke\`
│ 々 \`${config.prefix}story\` <topic>
│ 々 \`${config.prefix}define\` <word>
╰──────────────────────☉

╭──── 〔 *🛠️ 𝗧𝗢𝗢𝗟𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* 〕 ────
│ 々 \`${config.prefix}translate\` <lang> <text>
│ 々 \`${config.prefix}weather\` <city>
│ 々 \`${config.prefix}tts\` <text>
│ 々 \`${config.prefix}calc\` <expression>
│ 々 \`${config.prefix}time\` <city>
│ 々 \`${config.prefix}base64\` <text>
│ 々 \`${config.prefix}debase64\` <encoded>
╰──────────────────────☉

╭──── 〔 *👥 𝗚𝗥𝗢𝗨𝗣 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* 〕 ────
│ 々 \`${config.prefix}tagall\` <msg>
│ 々 \`${config.prefix}hidetag\` <msg>
│ 々 \`${config.prefix}kick\` @user
│ 々 \`${config.prefix}add\` <number>
│ 々 \`${config.prefix}promote\` @user
│ 々 \`${config.prefix}demote\` @user
│ 々 \`${config.prefix}close\`
│ 々 \`${config.prefix}open\`
│ 々 \`${config.prefix}grouplink\`
│ 々 \`${config.prefix}revoke\`
│ 々 \`${config.prefix}setname\` <name>
│ 々 \`${config.prefix}setdesc\` <desc>
│ 々 \`${config.prefix}groupinfo\`
│ 々 \`${config.prefix}leave\`
╰──────────────────────☉

╭──── 〔 *👑 𝗢𝗪𝗡𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* 〕 ────
│ 々 \`${config.prefix}owner\`
│ 々 \`${config.prefix}getpp\` @user
│ 々 \`${config.prefix}block\` @user
│ 々 \`${config.prefix}broadcast\` <msg>
╰──────────────────────☉

╭──── 〔 *⚡ 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* 〕 ────
│ 々 \`${config.prefix}alive\`
│ 々 \`${config.prefix}ping\`
│ 々 \`${config.prefix}speed\`
│ 々 \`${config.prefix}menu\`
│ 々 \`${config.prefix}repo\`
╰──────────────────────☉

> ⚡ _Powered by *${config.botName}* — Your AI-enhanced WhatsApp companion_
`.trim();

  await sendWithImage(sock, jid, menuText, msg);
}

module.exports = { menu };
