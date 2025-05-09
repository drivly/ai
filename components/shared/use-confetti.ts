import { CreateTypes } from 'canvas-confetti'
import { useCallback, useRef } from 'react'

const canvasStyles: any = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
}

const useConfetti = () => {
  const refAnimationInstance = useRef<CreateTypes | null>(null)

  const getInstance: ({ confetti }: { confetti: CreateTypes }) => void = useCallback(({ confetti }) => (refAnimationInstance.current = confetti), [])

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    refAnimationInstance.current &&
      refAnimationInstance?.current({
        ...opts,
        origin: { y: 0.7 },
        colors: ['#00CAB9', '#7FE4DC', 'CCF4F1'],
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  return { canvasStyles, getInstance, fire }
}

export default useConfetti
