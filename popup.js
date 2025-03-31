const siteInput = document.getElementById("siteInput");
const siteList = document.getElementById("siteList");
const addSiteBtn = document.getElementById("addSiteBtn");

const videoInput = document.getElementById("videoInput");
const videoList = document.getElementById("videoList");
const addVideoBtn = document.getElementById("addVideoBtn");

function afficherListe(liste, container, storageKey) {
    container.innerHTML = "";
    const maintenant = new Date();
    const heures = maintenant.getHours();
    const dansLaPlage = heures >= 12 && heures < 14;

    liste.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item;

        if (dansLaPlage) {
            const btn = document.createElement("button");
            btn.textContent = "❌";
            btn.style.marginLeft = "10px";
            btn.onclick = () => {
                liste.splice(index, 1);
                chrome.storage.local.set({ [storageKey]: liste }, () => {
                    afficherListe(liste, container, storageKey);
                });
            };
            li.appendChild(btn);
        }

        container.appendChild(li);
    });
}

addSiteBtn.onclick = () => {
    const site = siteInput.value.trim();
    if (!site) return;
    chrome.storage.local.get("sitesBloques", (data) => {
        const sites = data.sitesBloques || [];
        if (!sites.includes(site)) {
            sites.push(site);
            chrome.storage.local.set({ sitesBloques: sites }, () => {
                siteInput.value = "";
                afficherListe(sites, siteList, "sitesBloques");
            });
        }
    });
};

addVideoBtn.onclick = () => {
    const video = videoInput.value.trim();
    if (!video) return;
    chrome.storage.local.get("videosAutorisees", (data) => {
        const videos = data.videosAutorisees || [];
        if (!videos.includes(video)) {
            videos.push(video);
            chrome.storage.local.set({ videosAutorisees: videos }, () => {
                videoInput.value = "";
                afficherListe(videos, videoList, "videosAutorisees");
            });
        }
    });
};

// Initialisation
chrome.storage.local.get(["sitesBloques", "videosAutorisees"], (data) => {
    afficherListe(data.sitesBloques || [], siteList, "sitesBloques");
    afficherListe(data.videosAutorisees || [], videoList, "videosAutorisees");
});
