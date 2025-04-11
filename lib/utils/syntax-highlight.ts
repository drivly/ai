/**
 * Highlights JSON syntax and makes URLs clickable
 */
export function syntaxHighlightJson(json: string) {
  const urlMap = new Map<string, string>()
  let urlCounter = 0
  
  let processedJson = json.replace(/"(https:\/\/[^"\s]+)"/g, (match, url) => {
    const placeholder = `__URL_PLACEHOLDER_${urlCounter}__`
    urlMap.set(placeholder, url)
    urlCounter++
    return `"${placeholder}"`
  })
  
  let result = processedJson
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  result = result.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
    let cls = 'text-green-300' // string
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-blue-300' // key
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-yellow-300' // boolean
    } else if (/null/.test(match)) {
      cls = 'text-red-300' // null
    } else {
      cls = 'text-cyan-300' // number
    }
    return '<span class="' + cls + '">' + match + '</span>'
  })
  
  result = result.replace(/({|}|\[|\]|,|:)/g, (match) => {
    return '<span class="text-white">' + match + '</span>'
  })
  
  urlMap.forEach((url, placeholder) => {
    result = result.replace(new RegExp(`"${placeholder}"`, 'g'), `"<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-80">${url}</a>"`);
  })
  
  return result
}
