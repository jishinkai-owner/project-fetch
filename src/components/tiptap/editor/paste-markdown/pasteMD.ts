export function isMarkdown(text: string) {
  return /[#*_`[\]-]/.test(text);
}

export function isFlickrEmbed(text: string) {
  return /<a.*><img.*><\/a><script.*><\/script>/.test(text);
}
