document.addEventListener('DOMContentLoaded', async () => {
    // ----------------------------------------
    // 🔧 CONFIGURATION
    // Replace this with your actual Stripe Payment Link
    const PAYMENT_URL = "https://buy.stripe.com/fZu00l2ogd750HW3iB18c03"; 
    // ----------------------------------------

    // Elements
    const views = {
        main: document.getElementById('main-view'),
        settings: document.getElementById('settings-view')
    };
    const els = {
        urlDisplay: document.getElementById('url-display'),
        daValue: document.getElementById('da-value'),
        paValue: document.getElementById('pa-value'),
        daFill: document.getElementById('da-fill'),
        paFill: document.getElementById('pa-fill'),
        status: document.getElementById('status-message'),
        refreshBtn: document.getElementById('refresh-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        saveBtn: document.getElementById('save-settings'),
        cancelBtn: document.getElementById('cancel-settings'),
        accessId: document.getElementById('access-id'),
        secretKey: document.getElementById('secret-key'),
        buyLink: document.getElementById('buy-link')
    };

    // State
    let currentUrl = "";
    let domain = "";
    let isPro = false;

    // Initialize
    await loadSettings();
    await getCurrentTab();

    // Event Listeners
    els.refreshBtn.addEventListener('click', fetchData);
    els.settingsBtn.addEventListener('click', () => toggleView('settings'));
    els.cancelBtn.addEventListener('click', () => toggleView('main'));
    els.saveBtn.addEventListener('click', saveSettings);
    
    // Open Payment Link
    if (els.buyLink) {
        els.buyLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: PAYMENT_URL });
        });
    }

    // --- Core Logic ---
    
    async function checkProStatus() {
        const data = await chrome.storage.sync.get(['activationCode']);
        // Professional "Product Key" format
        if (data.activationCode === "PRO-8821-X9-DA") {
            isPro = true;
            document.body.classList.add('pro-active');
        }
    }

    async function getCurrentTab() {
        await checkProStatus();
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
            currentUrl = tab.url;
            try {
                const urlObj = new URL(currentUrl);
                domain = urlObj.hostname;
                els.urlDisplay.textContent = domain;
                // Auto-fetch immediately (works for both Mock and Real)
                fetchData();
            } catch (e) {
                els.urlDisplay.textContent = "Invalid URL";
                els.refreshBtn.disabled = true;
            }
        }
    }

    async function fetchData() {
        if (!isPro) {
            els.status.textContent = "🔒 License Required. Check Settings.";
            els.daValue.textContent = "🔒";
            els.paValue.textContent = "🔒";
            toggleView('settings');
            return;
        }

        if (!await hasKeys()) {
            els.status.textContent = "Missing API Keys.";
            toggleView('settings'); // Guide them to settings
            return;
        }

        setLoading(true);
        els.status.textContent = "Fetching from Moz...";

        try {
            const keys = await getKeys();
            const data = await fetchMozMetrics(domain, keys.id, keys.secret);
            
            // Render
            animateValue(els.daValue, data.da);
            animateValue(els.paValue, data.pa);
            
            els.daFill.style.width = `${data.da}%`;
            els.paFill.style.width = `${data.pa}%`;

            // Clear status on success (Cleaner UI)
            els.status.textContent = "";
        } catch (error) {
            console.error(error);
            els.status.textContent = "Error: " + error.message;
            els.daValue.textContent = "--";
            els.paValue.textContent = "--";
        } finally {
            setLoading(false);
        }
    }

    // --- Moz API Integration ---

    async function fetchMozMetrics(target, accessId, secretKey) {
        // Mozscape API Logic
        const expires = Math.floor(Date.now() / 1000) + 300; // 5 min expiry
        const stringToSign = `${accessId}\n${expires}`;
        const signature = await hmacSha1(secretKey, stringToSign);
        const encodedSig = encodeURIComponent(signature);
        
        // Flags: 103079215104 (DA + PA)
        const cols = "103079215104"; 
        const url = `https://lsapi.seomoz.com/linkscape/url-metrics/${encodeURIComponent(target)}?Cols=${cols}&AccessID=${accessId}&Expires=${expires}&Signature=${encodedSig}`;

        // Send to Background Script to avoid CORS
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: "FETCH_MOZ_METRICS", url: url },
                (response) => {
                    if (response && response.success) {
                        const json = response.data;
                        resolve({
                            da: Math.round(json.pda || 0),
                            pa: Math.round(json.upa || 0)
                        });
                    } else {
                        reject(new Error(response ? response.error : "Unknown Error"));
                    }
                }
            );
        });
    }

    // --- Crypto Helpers ---

    async function hmacSha1(key, message) {
        const enc = new TextEncoder();
        const keyData = await crypto.subtle.importKey(
            "raw", enc.encode(key), 
            { name: "HMAC", hash: "SHA-1" }, 
            false, ["sign"]
        );
        const signature = await crypto.subtle.sign(
            "HMAC", keyData, enc.encode(message)
        );
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    // --- UI Helpers ---

    function toggleView(viewName) {
        if (viewName === 'settings') {
            document.getElementById('settings-view').classList.add('active');
            document.getElementById('main-view').classList.remove('active');
        } else {
            document.getElementById('settings-view').classList.remove('active');
            document.getElementById('main-view').classList.add('active');
        }
    }

    function setLoading(isLoading) {
        els.refreshBtn.disabled = isLoading;
        els.refreshBtn.textContent = isLoading ? "Fetching..." : "Check Metrics";
        if (isLoading) {
            els.daValue.style.opacity = 0.5;
            els.paValue.style.opacity = 0.5;
        } else {
            els.daValue.style.opacity = 1;
            els.paValue.style.opacity = 1;
        }
    }

    function animateValue(element, end) {
        let start = 0;
        const duration = 1000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(start + (end - start) * ease);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // --- Settings Storage ---

    async function saveSettings() {
        const id = els.accessId.value.trim();
        const key = els.secretKey.value.trim();
        const code = document.getElementById('activation-code').value.trim();
        
        if (!id || !key) {
            alert("Please enter both Access ID and Secret Key.");
            return;
        }

        await chrome.storage.sync.set({ 
            mozAccessId: id, 
            mozSecretKey: key,
            activationCode: code
        });
        
        toggleView('main');
        els.status.textContent = "Settings saved.";
        
        // Re-check status and fetch
        await checkProStatus();
        fetchData();
    }

    async function loadSettings() {
        const data = await chrome.storage.sync.get(['mozAccessId', 'mozSecretKey', 'activationCode']);
        if (data.mozAccessId) els.accessId.value = data.mozAccessId;
        if (data.mozSecretKey) els.secretKey.value = data.mozSecretKey;
        if (data.activationCode) document.getElementById('activation-code').value = data.activationCode;
    }

    async function hasKeys() {
        const data = await chrome.storage.sync.get(['mozAccessId', 'mozSecretKey']);
        return data.mozAccessId && data.mozSecretKey;
    }

    async function getKeys() {
        const data = await chrome.storage.sync.get(['mozAccessId', 'mozSecretKey']);
        return { id: data.mozAccessId, secret: data.mozSecretKey };
    }
});
