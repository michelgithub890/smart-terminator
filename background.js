chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url) return;

    const url = new URL(tab.url);

    const maintenant = new Date();
    const heures = maintenant.getHours();
    const dansLaPlage = heures >= 12 && heures < 14;

    // ✅ Si on est dans la plage 12h–14h, ne rien bloquer
    if (dansLaPlage) return;

    chrome.storage.local.get(["sitesBloques", "videosAutorisees"], (data) => {
        const sites = data.sitesBloques || [];
        const videos = data.videosAutorisees || [];

        // --- Cas YouTube ---
        if (url.hostname.includes("youtube.com")) {
            const videoId = url.searchParams.get("v");
            const estAutorisee = videoId && videos.includes(videoId);

            if (!estAutorisee) {
                chrome.tabs.update(tabId, {
                    url: chrome.runtime.getURL("motivation.html")
                }).catch(() => {});
            }
            return;
        }

        // --- Cas des autres sites bloqués ---
        if (sites.some(site => url.hostname.includes(site))) {
            chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL("motivation.html")
            }).catch(() => {});
        }
    });
});
