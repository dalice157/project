import jwt from "jws";
import Fingerprint from "@/assets/js/fingerprint";
import java_hashcode from "@/assets/js/java_hashcode";
/***
 * device 參考
 * https://github.com/artem0/canvas-fingerprinting
 * https://www.wfublog.com/2020/11/js-track-user-device-browser-fingerprint.html
 *  下方三個變數則一使用
 * */
export const withCanvasDrawing = new Fingerprint({ canvas: true }).get();
export const withoutCanvasDrawing = new Fingerprint({ canvas: false }).get();
export const javaHashFunction = new Fingerprint({ hasher: java_hashcode }).get();
console.log("withCanvasDrawing:", withCanvasDrawing);
console.log("withoutCanvasDrawing:", withoutCanvasDrawing);
console.log("javaHashFunction:", javaHashFunction);
const headers = {
    alg: "ES256",
    typ: "JWT",
};
const payload = {
    dev: String(withCanvasDrawing),
};
const secret = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg98E7/hcplJHk2RIg
p0vCjbadq66iA5xKP77hQT9lKPqhRANCAAQVw8BuGncZHkt2MzU3UVsNIt3wdNW5
1sFame9gvobNlIw2XkJVsBTG44tNY4MVTMau1fBIJGZb20gnH8tlw/Dc
-----END PRIVATE KEY-----`;
export const signature = jwt.sign({
    header: headers,
    payload,
    secret,
});
