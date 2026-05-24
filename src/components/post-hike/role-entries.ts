export type NamedEntry = {
  name: string;
  body: string;
};

const BLOCK_SEPARATOR = "\n\n";

/** 【名前】\n本文 形式で複数人分を1フィールドに格納 */
export function parseNamedEntries(text: string | null | undefined): NamedEntry[] {
  if (!text?.trim()) return [];

  const trimmed = text.trim();
  if (!trimmed.includes("【")) {
    return [{ name: "", body: trimmed }];
  }

  return trimmed
    .split(/\n\n+/)
    .map((part) => {
      const match = part.match(/^【(.+?)】\n([\s\S]*)$/);
      if (match) {
        return { name: match[1].trim(), body: match[2].trim() };
      }
      return { name: "", body: part.trim() };
    })
    .filter((e) => e.body);
}

export function formatNamedEntries(entries: NamedEntry[]): string {
  return entries
    .filter((e) => e.body.trim())
    .map((e) =>
      e.name.trim()
        ? `【${e.name.trim()}】\n${e.body.trim()}`
        : e.body.trim(),
    )
    .join(BLOCK_SEPARATOR);
}

export function upsertNamedEntry(
  text: string | null | undefined,
  name: string,
  body: string,
): string {
  const trimmedName = name.trim();
  const trimmedBody = body.trim();
  if (!trimmedName || !trimmedBody) return text?.trim() ?? "";

  const entries = parseNamedEntries(text);
  const idx = entries.findIndex((e) => e.name === trimmedName);

  if (idx >= 0) {
    entries[idx] = { name: trimmedName, body: trimmedBody };
  } else {
    entries.push({ name: trimmedName, body: trimmedBody });
  }

  return formatNamedEntries(entries);
}

export function getNamedEntryBody(
  text: string | null | undefined,
  name: string,
): string {
  const entry = parseNamedEntries(text).find((e) => e.name === name.trim());
  return entry?.body ?? "";
}
