import { RM, fileEntry } from "./resourceManager";

export class ResourceBridge {

  private static blobCache = new Map<string, string>();

  // ---------------- core ----------------

  static resolve(resourceKey: string): string {
    const entry = RM.fileSource.get(resourceKey);
    if (!entry) return "";

    switch (entry.type) {

      case "imageFile":
        return this.resolveImage(resourceKey, entry);

      case "cssFile":
      case "htmlFile":
      case "rawFile":
      case "textFile":
      case "string":
      case "boolean":
      case "float":
      case "integer":
        return String(entry.value);

      default:
        return String(entry.value);
    }
  }

  static applyToText(text: string): string {
    return text.replace(/__RES::([a-zA-Z0-9-]+)__/g, (_, key) =>
      this.resolve(key)
    );
  }

  // ---------------- transformers ----------------

  private static resolveImage(key: string, entry: fileEntry): string {

    // if already a web-safe URL (data / blob / http)
    if (
      entry.value.startsWith("data:") ||
      entry.value.startsWith("blob:") ||
      entry.value.startsWith("http:")
    ) {
      return entry.value;
    }

    // cached blob?
    const cached = this.blobCache.get(key);
    if (cached) return cached;

    // otherwise assume base64 data url stored
    // (your ResourceManager already converts images to data:)
    if (entry.value.startsWith("data:")) {
      return entry.value;
    }

    // safety fallback: treat as data url
    const blob = this.dataUrlToBlob(entry.value);
    const blobUrl = URL.createObjectURL(blob);

    this.blobCache.set(key, blobUrl);
    return blobUrl;
  }

  private static dataUrlToBlob(dataUrl: string): Blob {
    const [meta, data] = dataUrl.split(",");
    const mime = meta.split(":")[1].split(";")[0];
    const isBase64 = meta.includes(";base64");

    const bin = isBase64 ? atob(data) : decodeURIComponent(data);
    const len = bin.length;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      arr[i] = bin.charCodeAt(i);
    }

    return new Blob([arr], { type: mime });
  }

  // ---------------- lifecycle ----------------

  static releaseAllBlobs() {
    for (const url of this.blobCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.blobCache.clear();
  }
}
