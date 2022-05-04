const env = process.env.VUE_APP_config || "development";
//api
const SERVER_SITE = {
    develop: "https://t.Talkod.im:9000",
    staging: "https://tbapi.talkod.im",
    production: "https://bapi.talkod.im",
};
const JANUS_SITE = {
    develop: "https://t.Talkod.im:8089",
    staging: "https://tj1.talkod.im:8089",
    production: "https://j1.talkod.im:8089",
};

const FILE_SITE = {
    develop: "https://t.talkod.im:8029/fls/",
    staging: "https://tfls.talkod.im/",
    production: "https://fls.talkod.im/",
};

const WORD_LIMIT = {
    develop: 20,
    staging: 18,
    production: 17,
};
const DOMAIN = {
    development: "1", // 如果不是COMMTEST把1改成0, 才可登入
    develop: "1",
    staging: "1",
    production: "1",
};

const setting = {
    development: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
        wordLimit: WORD_LIMIT.develop,
        domain: DOMAIN.development,
    },
    develop: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
        wordLimit: WORD_LIMIT.develop,
        domain: DOMAIN.develop,
    },
    staging: {
        serverUrl: SERVER_SITE.staging,
        janusUrl: JANUS_SITE.staging,
        fileUrl: FILE_SITE.staging,
        wordLimit: WORD_LIMIT.staging,
        domain: DOMAIN.staging,
    },
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
        fileUrl: FILE_SITE.production,
        wordLimit: WORD_LIMIT.production,
        domain: DOMAIN.production,
    },
};

export default setting[env];
