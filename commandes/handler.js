// ============================================================
//   N E X U S - B O T  |  Command Handler / Router
// ============================================================

const config = require('../config');
const { getMessageBody, getSender, isGroup, formatNumber, sendWithImage, reactTo } = require('./utils');

// Import command modules
const menuCmd = require('./menu');
const botCmd = require('./bot');
const aiCmd = require('./ai');
const groupCmd = require('./group');
const toolsCmd = require('./tools');
const ownerCmd = require('./owner');

async function handleMessage(sock, msg) {
  const body = getMessageBody(msg);
  const jid = msg.key.remoteJid;
  const sender = getSender(msg);
  const senderNumber = formatNumber(sender);
  const isOwner = senderNumber === config.ownerNumber;
  const inGroup = isGroup(msg);

  if (!body.startsWith(config.prefix)) return;

  const args = body.slice(config.prefix.length).trim().split(/\s+/);
  const command = args[0].toLowerCase();
  const q = args.slice(1).join(' ');

  const ctx = { sock, msg, jid, sender, senderNumber, isOwner, inGroup, args, command, q };

  console.log(`📩 [CMD] ${config.prefix}${command} | From: ${senderNumber}`);

  // React with hourglass while processing
  await reactTo(sock, msg, '⏳');

  try {
    switch (command) {
      // ── BOT COMMANDS ──
      case 'menu':
      case 'help':
        await menuCmd.menu(ctx);
        break;
      case 'alive':
        await botCmd.alive(ctx);
        break;
      case 'ping':
        await botCmd.ping(ctx);
        break;
      case 'speed':
        await botCmd.speed(ctx);
        break;
      case 'repo':
        await botCmd.repo(ctx);
        break;

      // ── AI COMMANDS ──
      case 'ai':
      case 'gpt':
        await aiCmd.askAI(ctx);
        break;
      case 'imagine':
      case 'img':
        await aiCmd.generateImage(ctx);
        break;
      case 'roast':
        await aiCmd.roast(ctx);
        break;
      case 'joke':
        await aiCmd.joke(ctx);
        break;
      case 'story':
        await aiCmd.story(ctx);
        break;
      case 'define':
        await aiCmd.define(ctx);
        break;

      // ── TOOLS COMMANDS ──
      case 'translate':
        await toolsCmd.translate(ctx);
        break;
      case 'weather':
        await toolsCmd.weather(ctx);
        break;
      case 'tts':
        await toolsCmd.tts(ctx);
        break;
      case 'calc':
        await toolsCmd.calc(ctx);
        break;
      case 'time':
        await toolsCmd.time(ctx);
        break;
      case 'base64':
        await toolsCmd.base64encode(ctx);
        break;
      case 'debase64':
        await toolsCmd.base64decode(ctx);
        break;

      // ── GROUP COMMANDS ──
      case 'tagall':
        await groupCmd.tagAll(ctx);
        break;
      case 'hidetag':
        await groupCmd.hideTag(ctx);
        break;
      case 'kick':
        await groupCmd.kick(ctx);
        break;
      case 'add':
        await groupCmd.add(ctx);
        break;
      case 'promote':
        await groupCmd.promote(ctx);
        break;
      case 'demote':
        await groupCmd.demote(ctx);
        break;
      case 'close':
        await groupCmd.closeGroup(ctx);
        break;
      case 'open':
        await groupCmd.openGroup(ctx);
        break;
      case 'grouplink':
        await groupCmd.groupLink(ctx);
        break;
      case 'revoke':
        await groupCmd.revoke(ctx);
        break;
      case 'setname':
        await groupCmd.setName(ctx);
        break;
      case 'setdesc':
        await groupCmd.setDesc(ctx);
        break;
      case 'groupinfo':
        await groupCmd.groupInfo(ctx);
        break;
      case 'leave':
        await groupCmd.leave(ctx);
        break;

      // ── OWNER COMMANDS ──
      case 'owner':
        await ownerCmd.owner(ctx);
        break;
      case 'getpp':
        await ownerCmd.getPP(ctx);
        break;
      case 'block':
        if (isOwner) await ownerCmd.block(ctx);
        else await sendWithImage(sock, jid, '❌ Only the bot owner can use this command.', msg);
        break;
      case 'broadcast':
        if (isOwner) await ownerCmd.broadcast(ctx);
        else await sendWithImage(sock, jid, '❌ Only the bot owner can use this command.', msg);
        break;

      default:
        await sendWithImage(
          sock,
          jid,
          `❓ *Unknown command:* \`${config.prefix}${command}\`\n\nType *${config.prefix}menu* to see all available commands.`,
          msg
        );
    }

    // React with checkmark on success
    await reactTo(sock, msg, '✅');
  } catch (err) {
    console.error(`❌ [Command Error] .${command}:`, err.message);
    await reactTo(sock, msg, '❌');
    await sendWithImage(
      sock,
      jid,
      `⚠️ *Error executing command:* \`${config.prefix}${command}\`\n\n_${err.message}_`,
      msg
    );
  }
}

module.exports = handleMessage;
  
