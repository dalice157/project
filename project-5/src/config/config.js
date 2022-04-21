const env = process.env.NODE_ENV || "development";
console.log(`"env" is ${env}`);

const SERVER_SITE = {
    develop: "https://t.Talkod.im:9000",
    production: "https://bapi.talkod.im",
};
const JANUS_SITE = {
    develop: "https://t.Talkod.im:8089",
    production: "https://j1.talkod.im:8089",
};

const FILE_SITE = {
    develop: "https://t.talkod.im:8029/fls/",
    production: "https://fls.talkod.im/",
};

const WORD_LIMIT = {
    develop: 20,
    production: 18,
};
const DOMAIN = {
    development: "1", // 如果不是COMMTEST把1改成0, 才可登入
    develop: "1",
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
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
        fileUrl: FILE_SITE.production,
        wordLimit: WORD_LIMIT.production,
        domain: DOMAIN.production,
    },
};

export default setting[env];
