const env = process.env.VUE_APP_config || "development";

const randomString = (len) => {
    var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = "";
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
};
//api
const SERVER_SITE = {
    develop: "https://t.talkod.im:9000",
    // develop: "https://t.talkod.im:9000",
    staging: "https://tbapi.talkod.im",
    production: "https://bapi.talkod.im",
};
const JANUS_SITE = {
    develop: "wss://t.talkod.im:8989",
    // develop: "https://t.talkod.im:8089",
    staging: "wss://tj1.talkod.im:443",
    // staging: "https://tj1.talkod.im:443",
    production: "wss://j1.talkod.im:443",
    // production: "https://j1.talkod.im:443",
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
const EXTRA_STRING = {
    develop: randomString(WORD_LIMIT.develop),
    staging: randomString(WORD_LIMIT.staging),
    production: randomString(WORD_LIMIT.production),
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
        extraString: EXTRA_STRING.develop,
        domain: DOMAIN.development,
    },
    develop: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
        fileUrl: FILE_SITE.develop,
        wordLimit: WORD_LIMIT.develop,
        extraString: EXTRA_STRING.develop,
        domain: DOMAIN.develop,
    },
    staging: {
        serverUrl: SERVER_SITE.staging,
        janusUrl: JANUS_SITE.staging,
        fileUrl: FILE_SITE.staging,
        wordLimit: WORD_LIMIT.staging,
        extraString: EXTRA_STRING.staging,
        domain: DOMAIN.staging,
    },
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
        fileUrl: FILE_SITE.production,
        wordLimit: WORD_LIMIT.production,
        extraString: EXTRA_STRING.production,
        domain: DOMAIN.production,
    },
};

export default setting[env];
