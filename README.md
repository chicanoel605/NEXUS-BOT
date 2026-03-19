# ⚡ NexusBot — WhatsApp AI Bot

> A powerful, feature-rich WhatsApp bot powered by **Baileys** and **OpenAI GPT-4o**

---

## 📁 Project Structure

```
nexus-bot/
├── index.js              ← Main bot entry point
├── config.js             ← Configuration (reads from .env)
├── .env                  ← Your secrets (API keys, owner number)
├── package.json
├── assets/
│   └── banner.jpg        ← ⬅️ Place YOUR image here!
├── commands/
│   ├── handler.js        ← Command router
│   ├── menu.js           ← .menu command
│   ├── bot.js            ← .alive, .ping, .speed, .repo
│   ├── ai.js             ← .ai, .imagine, .roast, .joke, .story, .define
│   ├── tools.js          ← .translate, .weather, .tts, .calc, .time, .base64
│   ├── group.js          ← All group management commands
│   ├── owner.js          ← .owner, .getpp, .block, .broadcast
│   └── utils.js          ← Shared helpers
└── web/
    ├── server.js          ← Express pairing server
    └── public/
        └── index.html     ← Pairing website UI
```

---

## 🖼️ Adding Your Bot Image

Place **ONE image** (jpg/png) in the `assets/` folder and name it `banner.jpg`.

```
assets/
└── banner.jpg   ← This image is sent with EVERY bot response
```

> To use a different name/format, edit `config.js` → `botImage: './assets/your-image.png'`

---

## 🔑 Getting Your API Keys

### 1. OpenAI API Key
1. Go to **https://platform.openai.com/api-keys**
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. Paste it in `.env` as `OPENAI_API_KEY=sk-...`

> ⚠️ You need a paid OpenAI account or active credits for GPT-4o and DALL-E 3.

---

## ⚙️ Configuration (.env file)

Open the `.env` file and fill in:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx   ← From platform.openai.com
OWNER_NUMBER=2348012345678                   ← Your number (country code, no +)
BOT_NAME=NexusBot
BOT_VERSION=1.0.0
PREFIX=.
PORT=3000
```

---

## 🤖 Bot Commands

| Command | Description |
|--------|-------------|
| `.menu` | Show full command menu |
| `.alive` | Check if bot is online |
| `.ping` | Test bot latency |
| `.speed` | Speed test |
| `.ai <question>` | Ask GPT-4o anything |
| `.imagine <prompt>` | Generate an image with DALL-E 3 |
| `.roast <name>` | AI-powered roast |
| `.joke` | Get a random joke |
| `.story <topic>` | Generate a short story |
| `.define <word>` | Dictionary definition |
| `.translate <lang> <text>` | Translate text |
| `.weather <city>` | Get weather info |
| `.tts <text>` | Text to speech (voice note) |
| `.calc <expression>` | Calculator |
| `.time <timezone>` | Current time |
| `.base64 <text>` | Encode to base64 |
| `.debase64 <text>` | Decode from base64 |
| `.tagall <msg>` | Tag all group members |
| `.hidetag <msg>` | Hidden tag all members |
| `.kick @user` | Remove member (admin only) |
| `.add <number>` | Add member (admin only) |
| `.promote @user` | Make admin |
| `.demote @user` | Remove admin |
| `.close` | Lock group |
| `.open` | Unlock group |
| `.grouplink` | Get invite link |
| `.revoke` | Reset invite link |
| `.setname <name>` | Change group name |
| `.setdesc <desc>` | Change group description |
| `.groupinfo` | View group details |
| `.owner` | Show owner info |
| `.getpp @user` | Get profile picture |
| `.block @user` | Block a user (owner only) |

---

## 🚀 Deploy on Render (FREE) — Step by Step

### STEP 1: Upload to GitHub

1. Go to **https://github.com** → Create a free account if needed
2. Click **"New repository"** → Name it `nexus-bot` → Set to **Public** → Create
3. On your computer/phone, install **GitHub Desktop** or use **Termux** (Android)

**Using Termux on Android:**
```bash
pkg install git nodejs
git config --global user.name "YourName"
git config --global user.email "you@email.com"
cd nexus-bot
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOURUSERNAME/nexus-bot.git
git push -u origin main
```

> ⚠️ Do NOT push your `.env` file — it's in `.gitignore` for security!

---

### STEP 2: Add Environment Variables to GitHub (Secrets)

You'll add these in Render, not GitHub.

---

### STEP 3: Deploy on Render

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → Select **"Web Service"**
3. Click **"Connect a repository"** → Select `nexus-bot`
4. Fill in the settings:
   - **Name:** `nexus-bot` (or any name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** **Free**

5. Scroll to **"Environment Variables"** → Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-your-key-here` |
| `OWNER_NUMBER` | `2348012345678` |
| `BOT_NAME` | `NexusBot` |
| `BOT_VERSION` | `1.0.0` |
| `PREFIX` | `.` |
| `PORT` | `3000` |

6. Click **"Create Web Service"**

Render will build and deploy your bot. Wait 2-5 minutes.

---

### STEP 4: Get Your Pairing Link

After deployment, Render gives you a URL like:
```
https://nexus-bot-xxxx.onrender.com
```

This is your **pairing website**! Share this link so people can enter their number and get a pairing code.

---

### STEP 5: Connect Your WhatsApp

1. Visit your Render URL
2. Enter your phone number with country code
3. Click **"Generate Pairing Code"**
4. Open WhatsApp → Three dots → Linked Devices → Link with phone number
5. Enter the code shown on screen
6. ✅ Bot is live!

---

## ⚠️ Important Notes

- **Free Render plan** spins down after 15 minutes of inactivity. Use **UptimeRobot** (free) to ping your URL every 5 minutes to keep it awake.
- **UptimeRobot:** https://uptimerobot.com → Add monitor → Enter your Render URL → Set interval to 5 min
- The session is saved in the `session/` folder. If Render restarts, you'll need to re-pair. Consider upgrading to Render's paid plan or use a persistent disk.
- Keep your `.env` file private. NEVER share your `OPENAI_API_KEY`.

---

## 💜 Powered by NexusBot

