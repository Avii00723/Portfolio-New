import { useEffect, useRef } from 'react'

export default function ProgressBar() {
  const barRef = useRef(null)

  useEffect(() => {
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? window.scrollY / docHeight : 0
        if (barRef.current) {
          barRef.current.style.width = `${progress * 100}%`
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div className="progress-bar" ref={barRef} />
}
