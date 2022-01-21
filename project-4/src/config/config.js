const env = process.env.NODE_ENV || "development";
console.log(`"env" is ${env}`);
const SERVER_SITE = {
    develop: "https://test.gayu.biz:443",
    production: "https://test.gayu.biz:443",
};
const JANUS_SITE = {
    develop: "https://test.gayu.biz:8089",
    production: "https://test.gayu.biz:8089",
};

const setting = {
    development: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
    },
    develop: {
        serverUrl: SERVER_SITE.develop,
        janusUrl: JANUS_SITE.develop,
    },
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
    },
};

export default setting[env];
