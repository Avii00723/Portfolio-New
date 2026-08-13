import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_IMPORTS = import.meta.glob('../../assets/ezgif-frame-*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const FRAMES = Object.entries(FRAME_IMPORTS)
  .filter(([path]) => {
    const frameNumber = Number((path.match(/ezgif-frame-(\d+)/i)?.[1] ?? '0'))
    return frameNumber !== 1
  })
  .sort(([left], [right]) => {
    const leftNumber = Number((left.match(/ezgif-frame-(\d+)/i)?.[1] ?? '0'))
    const rightNumber = Number((right.match(/ezgif-frame-(\d+)/i)?.[1] ?? '0'))
    return leftNumber - rightNumber
  })
  .map(([, src]) => src)

export default function Hero() {
  const pinRef = useRef(null)
  const canvasRef = useRef(null)
  const contentRef = useRef(null)
  const cueRef = useRef(null)
  const imagesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx || !FRAMES.length) return

    const total = FRAMES.length
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    function drawCover(img) {
      const cw = canvas.width
      const ch = canvas.height
      const iw = img.width
      const ih = img.height
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    function render(frameIndex) {
      const img = imagesRef.current[frameIndex]
      if (img && img.complete && img.naturalWidth) drawCover(img)
    }

    function preload() {
      imagesRef.current = FRAMES.map((src) => {
        const img = new Image()
        img.src = src
        return img
      })

      const firstImg = imagesRef.current[0]
      if (firstImg) {
        firstImg.onload = () => render(0)
      }
    }

    resizeCanvas()
    preload()

    if (reduceMotion) {
      if (pinRef.current) pinRef.current.style.height = '100vh'
      window.addEventListener('load', () => render(Math.floor(total * 0.55)))
      return
    }

    const updateFrameFromScroll = (progress) => {
      const frameIndex = Math.min(total - 1, Math.round(progress * (total - 1)))
      render(frameIndex)

      if (contentRef.current) {
        const fadeProgress = Math.min(1, progress / 0.32)
        contentRef.current.style.opacity = String(1 - fadeProgress)
        contentRef.current.style.transform = `translateY(${fadeProgress * 24}px)`
      }

      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - Math.min(1, progress / 0.08))
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => updateFrameFromScroll(self.progress),
      onRefresh: (self) => updateFrameFromScroll(self.progress),
    })

    const onResize = () => {
      resizeCanvas()
      updateFrameFromScroll(trigger.progress)
    }
    window.addEventListener('resize', onResize)

    return () => {
      trigger.kill()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="hero-pin" ref={pinRef}>
      <div className="hero-sticky">
        <canvas id="seq-canvas" ref={canvasRef} />
        <div className="hero-scrim" />
        <div className="hero-content" ref={contentRef}>
          <div className="eyebrow mono">
            <span className="line" />PORTFOLIO
          </div>
          <h1>Avinash Wagh</h1>
          <h3 className="role">
           Hi, I’m Avinash Wagh — a software developer passionate about building modern, scalable web and mobile applications. I work with React, TypeScript, Node.js, Flutter, and Java, and enjoy turning ideas into clean, user-focused digital experiences.
          </h3>
        </div>
        <div className="scroll-cue mono" ref={cueRef}>
          <span>SCROLL</span>
          <span className="stick" />
        </div>
      </div>
    </div>
  )
}
