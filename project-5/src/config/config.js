const env = process.env.NODE_ENV || "development";
console.log(`"env" is ${env}`);
const SERVER_SITE = {
    develop: "https://t.Talkod.im:9000",
    production: "https://Talkod.im",
};
const JANUS_SITE = {
    develop: "https://t.Talkod.im:8089",
    production: "https://Talkod.im",
};

const FILE_SITE = {
    develop: "https://t.Talkod.im:8029",
    production: "https://Talkod.im",
};

const WORD_LIMIT = {
    develop: 19,
    production: 17,
};

const setting = {
    development: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
        wordLimit: WORD_LIMIT.develop,
    },
    develop: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
        wordLimit: WORD_LIMIT.develop,
    },
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
        fileUrl: FILE_SITE.production,
        wordLimit: WORD_LIMIT.production,
    },
};

export default setting[env];
