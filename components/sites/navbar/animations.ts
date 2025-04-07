export const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] }

export const heightAnimation = {
  initial: { height: 0 },
  enter: {
    height: 'auto',
    transition,
  },
  exit: {
    height: 0,
    transition,
  },
}

export const translateAnimation = {
  initial: { y: '100%', opacity: 0 },
  enter: (i: number[]) => ({
    y: 0,
    opacity: 1,
    transition: { ...transition, delay: i[0] },
  }),
  exit: (i: number[]) => ({
    y: '100%',
    opacity: 0,
    transition: { ...transition, duration: 0.7, delay: i[1] },
  }),
}

export const blurAnimation = {
  initial: {
    opacity: 0,
    filter: 'blur(0px)',
  },
  blur: {
    filter: 'blur(4px)',
    opacity: 0.6,
    transition: { duration: 0.3 },
  },
  unblur: {
    filter: 'blur(0px)',
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

export const backgroundAnimation = {
  initial: { height: 0 },
  enter: { height: '100vh', transition },
  exit: { height: 0, transition },
}
