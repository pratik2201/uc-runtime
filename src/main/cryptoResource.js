import crypto from "crypto";
const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const A = Buffer.from("2201");
const B = Buffer.from("ap");
const C = Buffer.from("2407");
const SECRET = Buffer.concat([A, B, C]);
export function encryptResource(data) {
    const iv = crypto.randomBytes(IV_LEN);
    const cipher = crypto.createCipheriv(ALGO, SECRET, iv);
    const enc = Buffer.concat([
        cipher.update(data, "utf8"),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, enc]).toString("base64");
}
export function decryptResource(base64) {
    const buf = Buffer.from(base64, "base64");
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + 16);
    const data = buf.subarray(IV_LEN + 16);
    const decipher = crypto.createDecipheriv(ALGO, SECRET, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]).toString("utf8");
}
//# sourceMappingURL=cryptoResource.js.map