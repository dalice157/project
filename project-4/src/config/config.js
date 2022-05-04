const env = process.env.VUE_APP_config || "development";
// api
const SERVER_SITE = {
    develop: "https://t.talkod.im:443",
    staging: "https://tfapi.talkod.im",
    production: "https://fapi.talkod.im",
};
const JANUS_SITE = {
    develop: "https://t.talkod.im:8089",
    staging: "https://tj1.talkod.im:8089",
    production: "https://j1.talkod.im:8089",
};
const FILE_SITE = {
    develop: "https://t.talkod.im:8029/fls/",
    staging: "https://tfls.talkod.im/",
    production: "https://fls.talkod.im/",
};

const setting = {
    development: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
    },
    develop: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
    },
    staging: {
        serverUrl: SERVER_SITE.staging,
        janusUrl: JANUS_SITE.staging,
        fileUrl: FILE_SITE.staging,
    },
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
        fileUrl: FILE_SITE.production,
    },
};

export default setting[env];
