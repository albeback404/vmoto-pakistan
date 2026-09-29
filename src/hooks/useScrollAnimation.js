import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useReveal(options = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', ...options })
  return { ref, inView }
}
