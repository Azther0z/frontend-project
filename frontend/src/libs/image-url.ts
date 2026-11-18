export function imageUrlError(value: string): string | null {
  const url = value.trim();
  if (!url) return null;
  if (url.length <= 2048) {
    try {
      const parsed = new URL(url);
      if (["http:", "https:"].includes(parsed.protocol) && !parsed.username && !parsed.password) return null;
    } catch {
      // The same message covers malformed URLs and unsupported schemes.
    }
  }
  return "Use a complete HTTP or HTTPS image URL without embedded credentials (at most 2048 characters).";
}

export function isGoogleDriveUrl(value: string): boolean {
  try {
    return ["drive.google.com", "www.drive.google.com"].includes(new URL(value.trim()).hostname);
  } catch {
    return false;
  }
}

export function imageSourceUrl(value: string): string {
  const source = value.trim();
  if (imageUrlError(source) || !isGoogleDriveUrl(source)) return source;
  const url = new URL(source);
  const pathId = /^\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)(?:\/|$)/.exec(url.pathname)?.[1];
  const queryId = ["/open", "/uc", "/thumbnail"].includes(url.pathname) ? url.searchParams.get("id") : null;
  const fileId = pathId ?? queryId;
  if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) return source;

  // Keep the original sharing link in storage. Resolve only the displayed image.
  const thumbnail = new URL("https://drive.google.com/thumbnail");
  thumbnail.searchParams.set("id", fileId);
  thumbnail.searchParams.set("sz", "w1200");
  const resourceKey = url.searchParams.get("resourcekey");
  if (resourceKey) thumbnail.searchParams.set("resourcekey", resourceKey);
  return thumbnail.toString();
}
