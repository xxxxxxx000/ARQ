import { useEffect, useRef } from 'react'

export default function GymBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle nodes for athletic energy constellation
    const particleCount = Math.min(45, Math.floor(width / 30))
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    let time = 0

    const render = () => {
      time += 0.01
      ctx.clearRect(0, 0, width, height)

      // 1. Cinematic Deep Mesh & Vignette
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      )
      bgGrad.addColorStop(0, 'rgba(10, 132, 255, 0.08)')
      bgGrad.addColorStop(0.5, 'rgba(14, 18, 28, 0.6)')
      bgGrad.addColorStop(1, 'rgba(10, 10, 12, 0.95)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // 2. Athletic Pulse Beam at Top
      const beamGrad = ctx.createLinearGradient(0, 0, width, 0)
      const pulsePos = (Math.sin(time * 0.8) + 1) / 2
      beamGrad.addColorStop(0, 'rgba(10, 132, 255, 0)')
      beamGrad.addColorStop(Math.max(0, pulsePos - 0.15), 'rgba(10, 132, 255, 0)')
      beamGrad.addColorStop(pulsePos, 'rgba(100, 210, 255, 0.25)')
      beamGrad.addColorStop(Math.min(1, pulsePos + 0.15), 'rgba(10, 132, 255, 0)')
      beamGrad.addColorStop(1, 'rgba(10, 132, 255, 0)')
      ctx.fillStyle = beamGrad
      ctx.fillRect(0, 0, width, 2)

      // 3. Connect close energy nodes with athletic neural filaments
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 130

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(10, 132, 255, ${alpha})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // 4. Draw glowing energy particles
      for (const p of particles) {
        p.pulsePhase += p.pulseSpeed
        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 210, 255, ${Math.max(0.05, currentAlpha)})`
        ctx.shadowColor = '#0a84ff'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0 // reset shadow for performance

        // Update particle positions
        p.x += p.vx
        p.y += p.vy

        // Wrap around boundaries
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="gym-animated-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
