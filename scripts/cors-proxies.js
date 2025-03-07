CORS_PROXIES = {
    off: "",
    euOrg: "https://cors.eu.org/",
    corsproxyIo: "https://corsproxy.io/?url=",
    allOrigins: "https://api.allorigins.win/raw?url=",
    fringeZone: "https://cors-proxy.fringe.zone/",
    sirjosh: "https://cors-get-proxy.sirjosh.workers.dev/?url=",
};

function rewriteUrl(corsProxy, url) {
    return CORS_PROXIES[corsProxy] + url;
}