export function resolvePathname(pathname: string) {
  let newPath = ''
  switch (true) {
    case pathname.startsWith('/gpt.do'):
      newPath = `/gpt.do/chat`
      break
    case pathname.startsWith('/chat-ui'):
      newPath = `/chat-ui/chat`
      break
    case pathname.startsWith('/sites/gpt.do'):
      newPath = `/sites/gpt.do/chat`
      break
    default:
      newPath = `/chat`
  }
  return newPath
}


export const guestRegex = /^guest-\d+$/
