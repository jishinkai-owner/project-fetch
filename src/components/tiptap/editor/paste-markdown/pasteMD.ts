export function isMarkdown(text: string) {
  return /[#*_`\[\]\-]/.test(text);
}
