export const MAX_DOCUMENT_BYTES = 3 * 1024 * 1024;
export const SUPPORTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export type SupportedDocumentType = (typeof SUPPORTED_DOCUMENT_TYPES)[number];

export function isSupportedDocument(type: string, bytes: Uint8Array): type is SupportedDocumentType {
  if (type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  return false;
}
