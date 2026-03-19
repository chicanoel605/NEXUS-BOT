// ============================================================
//   N E X U S - B O T  |  Tools Commands
// ============================================================

const axios = require('axios');
const { OpenAI } = require('openai');
const config = require('../config');
const { sendWithImage } = require('./utils');

function getOpenAI() {
  return new OpenAI({ apiKey: config.openaiKey });
}

// ── TRANSLATE ────────────────────────────────────────────────
async function translate({ sock, msg, jid, args, q }) {
  // Usage: .translate es Hello world
  if (args.length < 3) {
    return sendWithImage(
      sock, jid,
      '🌐 *Usage:* `.translate <lang_code> <text>`\n\n_Example: `.translate fr Hello, how are you?`_\n\n*Common codes:* es=Spanish, fr=French, de=German, ja=Japanese, ar=Arabic, pt=Portuguese, zh=Chinese',
      msg
    );
  }

  const targetLang = args[1];
  const textToTranslate = args.slice(2).join(' ');
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Translate the user's text to ${targetLang}. Only return the translated text, nothing else.`,
      },
      { role: 'user', content: textToTranslate },
    ],
    max_tokens: 300,
  });

  const translated = response.choices[0].message.content.trim();
  const text = `🌐 *Translation*\n\n*Original:* ${textToTranslate}\n*Language:* \`${targetLang}\`\n*Translated:* ${translated}`;
  await sendWithImage(sock, jid, text, msg);
}

// ── WEATHER ──────────────────────────────────────────────────
async function weather({ sock, msg, jid, q }) {
  if (!q) {
    return sendWithImage(sock, jid, '🌤️ *Usage:* `.weather <city>`\n\n_Example: `.weather Lagos`_', msg);
  }

  // Use wttr.in (free, no API key needed)
  const url = `https://wttr.in/${encodeURIComponent(q)}?format=j1`;
  const res = await axios.get(url, { timeout: 8000 });
  const data = res.data;

  const current = data.current_condition[0];
  const area = data.nearest_area[0];
  const cityName = area.areaName[0].value;
  const country = area.country[0].value;

  const temp_c = current.temp_C;
  const temp_f = current.temp_F;
  const feels_c = current.FeelsLikeC;
  const humidity = current.humidity;
  const windspeed = current.windspeedKmph;
  const desc = current.weatherDesc[0].value;

  const emoji =
    desc.toLowerCase().includes('sun') || desc.toLowerCase().includes('clear') ? '☀️' :
    desc.toLowerCase().includes('rain') ? '🌧️' :
    desc.toLowerCase().includes('cloud') ? '☁️' :
    desc.toLowerCase().includes('snow') ? '❄️' :
    desc.toLowerCase().includes('thunder') ? '⛈️' : '🌤️';

  const text = `
${emoji} *Weather: ${cityName}, ${country}*

╭──── 〔 *🌡️ CONDITIONS* 〕 ────
│ 々 *Condition :* ${desc}
│ 々 *Temperature :* ${temp_c}°C / ${temp_f}°F
│ 々 *Feels Like :* ${feels_c}°C
│ 々 *Humidity :* ${humidity}%
│ 々 *Wind Speed :* ${windspeed} km/h
╰──────────────────────☉
`.trim();

  await sendWithImage(sock, jid, text, msg);
}

// ── TEXT TO SPEECH (via OpenAI TTS) ─────────────────────────
async function tts({ sock, msg, jid, q }) {
  if (!q) {
    return sendWithImage(sock, jid, '🔊 *Usage:* `.tts <text>`\n\n_Example: `.tts Hello, I am NexusBot!`_', msg);
  }

  const openai = getOpenAI();
  const mp3Response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: q,
  });

  const buffer = Buffer.from(await mp3Response.arrayBuffer());

  await sock.sendMessage(jid, {
    audio: buffer,
    mimetype: 'audio/mpeg',
    ptt: true, // Send as voice note
  }, { quoted: msg });

  await sendWithImage(sock, jid, `🔊 *Text-to-Speech*\n\n_"${q}"_\n\n⬆️ Voice note sent above!`, msg);
}

// ── CALCULATOR ───────────────────────────────────────────────
async function calc({ sock, msg, jid, q }) {
  if (!q) {
    return sendWithImage(sock, jid, '🧮 *Usage:* `.calc <expression>`\n\n_Example: `.calc 25 * 4 + 10`_', msg);
  }

  try {
    // Safe math evaluation
    const sanitized = q.replace(/[^0-9+\-*/.() %^]/g, '');
    if (!sanitized) throw new Error('Invalid expression');
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!isFinite(result)) throw new Error('Result is not a finite number');

    const text = `🧮 *Calculator*\n\n*Expression:* \`${q}\`\n*Result:* \`${result}\``;
    await sendWithImage(sock, jid, text, msg);
  } catch {
    await sendWithImage(sock, jid, `❌ *Invalid expression:* \`${q}\`\n\n_Please use valid math like: 5 * (3 + 2)_`, msg);
  }
}

// ── TIME ─────────────────────────────────────────────────────
async function time({ sock, msg, jid, q }) {
  const city = q || 'UTC';
  try {
    // Use worldtimeapi.org (free)
    const url = `https://worldtimeapi.org/api/timezone/${encodeURIComponent(city.replace(' ', '_'))}`;
    const res = await axios.get(url, { timeout: 6000 });
    const data = res.data;
    const datetime = new Date(data.datetime);
    const formatted = datetime.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

    const text = `🕐 *Current Time*\n\n╭──── 〔 *⏰ TIME INFO* 〕 ────\n│ 々 *Location:* ${data.timezone}\n│ 々 *Date & Time:* ${formatted}\n│ 々 *UTC Offset:* ${data.utc_offset}\n╰──────────────────────☉`;
    await sendWithImage(sock, jid, text, msg);
  } catch {
    // Fallback to UTC
    const now = new Date().toUTCString();
    await sendWithImage(sock, jid, `🕐 *Current UTC Time:* ${now}\n\n_Tip: Use `.time Africa/Lagos` for a specific timezone_`, msg);
  }
}

// ── BASE64 ENCODE ────────────────────────────────────────────
async function base64encode({ sock, msg, jid, q }) {
  if (!q) {
    return sendWithImage(sock, jid, '🔒 *Usage:* `.base64 <text>`\n\n_Example: `.base64 Hello World`_', msg);
  }
  const encoded = Buffer.from(q).toString('base64');
  const text = `🔒 *Base64 Encoded*\n\n*Input:* ${q}\n*Output:* \`${encoded}\``;
  await sendWithImage(sock, jid, text, msg);
}

// ── BASE64 DECODE ────────────────────────────────────────────
async function base64decode({ sock, msg, jid, q }) {
  if (!q) {
    return sendWithImage(sock, jid, '🔓 *Usage:* `.debase64 <encoded>`\n\n_Example: `.debase64 SGVsbG8gV29ybGQ=`_', msg);
  }
  try {
    const decoded = Buffer.from(q, 'base64').toString('utf8');
    const text = `🔓 *Base64 Decoded*\n\n*Input:* \`${q}\`\n*Output:* ${decoded}`;
    await sendWithImage(sock, jid, text, msg);
  } catch {
    await sendWithImage(sock, jid, `❌ *Invalid Base64 string:* \`${q}\``, msg);
  }
}

module.exports = { translate, weather, tts, calc, time, base64encode, base64decode };
