
export function normalizeRange(row1, col1, row2, col2) {
  const rmin = Math.min(row1, row2);
  const rmax = Math.max(row1, row2);
  const cmin = Math.min(col1, col2);
  const cmax = Math.max(col1, col2);

  return { rmin, rmax, cmin, cmax };
}
export function parseClipboardText(text) {
  if (!text) return [];
  const rows = text.replace(/\r\n/g, "\n").split("\n");
  return rows.map((row) => row.split("\t"));
}
