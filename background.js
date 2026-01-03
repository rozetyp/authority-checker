// background.js - Handles API requests to bypass CORS restrictions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FETCH_MOZ_METRICS") {
        fetchMozData(request.url)
            .then(data => sendResponse({ success: true, data: data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep the message channel open for async response
    }
});

async function fetchMozData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Forward the status code for better error handling
            if (response.status === 401) throw new Error("Invalid Credentials (401)");
            throw new Error(`API Error ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
