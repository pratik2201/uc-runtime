import crypto from "crypto";
const ALGO = "aes-256-gcm";
const secret = 'sharepnl::9f3c7c1a-0c3e-4b3b-b0a3-18a7d8a1b912::resources';
export function encryptResource(text: string) {
    const iv = crypto.randomBytes(12);
    const key = crypto.scryptSync(secret, "ucbuilder-res", 32); 
    const cipher = crypto.createCipheriv(ALGO, key, iv);  
    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptResource(base64: string) {
   
    const raw = Buffer.from(base64, "base64");  
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);

    const key = crypto.scryptSync(secret, "ucbuilder-res", 32);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(data, undefined, "utf8") + decipher.final("utf8");
}   