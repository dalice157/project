const env = process.env.NODE_ENV || "development";
console.log(`"env" is ${env}`);
const SERVER_SITE = {
    develop: "https://test.gayu.biz:9000",
    production: "https://192.168.1.178:9000",
};
const JANUS_SITE = {
    develop: "https://test.gayu.biz:8089",
    production: "https://test.gayu.biz:8089",
};

const FILE_SITE = {
    develop: "https://test.gayu.biz:8029",
    production: "https://test.gayu.biz:443",
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
    production: {
        serverUrl: SERVER_SITE.production,
        janusUrl: JANUS_SITE.production,
        fileUrl: FILE_SITE.production,
    },
};

export default setting[env];
