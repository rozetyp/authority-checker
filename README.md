# Reliable DA Checker 📊

**The Privacy-First, No-Bloat Domain Authority Tool.**

Tired of MozBar crashing? Hating the "Login Session Expired" errors?  
Reliable DA Checker is the lightweight alternative for professional SEOs.

---

## 🚀 Why This Extension Exists

Standard SEO toolbars are bloated and invasive. They track your browsing history, slow down your browser, and constantly log you out.

**Reliable DA Checker does one thing perfectly:** Shows you Domain Authority (DA) and Page Authority (PA) instantly—without the bloat.

---

## 💸 Save 95% Compared to Moz Pro

- **Moz Pro:** $99/month  
- **Moz API:** $5/month (or FREE for small volume)  

By using your own API key with this extension, you get the **exact same official Moz data** for a fraction of the price.

**Moz API Tiers:**
- **Free Tier:** 50 URLs/month (Perfect for casual use)  
- **Paid Tier:** Starts at $5/month for thousands of URLs  

[Get your Moz API key →](https://moz.com/products/api/keys)

---

## 🔒 Privacy First (BYOK)

This extension follows the **Bring Your Own Key (BYOK)** philosophy:

✅ **No Intermediate Server** – The extension talks directly from your browser to Moz  
✅ **No Tracking** – We don't see what you check. We don't sell your data  
✅ **Open Source** – Verify the code yourself  
✅ **Local Signing** – HMAC signatures generated client-side using `crypto.subtle`

---

## ⚙️ Quick Setup Guide

### Step 1: Get Your Moz API Keys (Free)
1. Go to [Moz API Dashboard](https://moz.com/products/api/keys)
2. Sign up for a free Moz Community account (if you don't have one)
3. Generate your **Access ID** and **Secret Key**

### Step 2: Install the Extension
1. Download/install from Chrome Web Store (or load unpacked for development)
2. Click the extension icon in your toolbar
3. The extension will prompt you to enter credentials

### Step 3: Activate Your License
1. Click **"Get License ($4.99)"** in the Settings
2. Complete payment via Stripe
3. Copy your license key from the confirmation page
4. Paste it into **"Activation Code"** field

### Step 4: Enter Your Moz API Keys
1. Paste your **Access ID** (looks like `mozscape-...`)
2. Paste your **Secret Key** (a long alphanumeric string)
3. Click **"Save & Close"**

### Step 5: Start Checking DA/PA
- Navigate to any website
- Click the extension icon
- Instant DA and PA scores appear!

---

## 🛠 For Developers

### Technical Architecture
- **Manifest V3** Chrome Extension
- **No Backend** – Fully client-side operation
- **CORS Bypass** – Background service worker proxies API requests
- **Security** – HMAC-SHA1 signatures generated using `crypto.subtle` API
- **Storage** – Credentials stored in `chrome.storage.sync`

### Project Structure
```
.
├── manifest.json      # Extension manifest (Manifest V3)
├── popup.html         # Main UI (unified view)
├── popup.js           # UI logic & HMAC signing
├── background.js      # Service worker (CORS proxy)
├── icons/             # Extension icons (16, 48, 128px)
└── README.md          # This file
```

### Local Development
1. Clone this repo
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → Select this folder
5. Extension is now active in development mode

### How HMAC Signing Works
The extension generates **HMAC-SHA1** signatures locally in `popup.js`:
```javascript
const expires = Math.floor(Date.now() / 1000) + 300;
const stringToSign = accessId + '\n' + expires;
const signature = await generateHMAC(secretKey, stringToSign);
```

This ensures your **Secret Key never leaves your machine**.

---

## 📝 License

This extension is licensed for personal and commercial use with a one-time payment.  
The source code is available for verification and transparency.

---

## 🐛 Support

Issues or questions? Open an issue on [GitHub](https://github.com/rozetyp/authority-checker) or contact support.

---

**Made for SEO pros who value speed, privacy, and savings.** 🚀
