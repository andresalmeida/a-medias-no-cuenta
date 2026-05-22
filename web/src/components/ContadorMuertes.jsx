import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

function useCount(target, duration = 2400, started = false) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!started) return
    const start = performance.now()

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, target, duration])

  return count
}

export default function ContadorMuertes() {
  const [ref, inView] = useInView(0.3)
  const muertos = useCount(25708, 2600, inView)
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setTextVisible(true), 1400)
      return () => clearTimeout(t)
    }
  }, [inView])

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: '#0d0a07',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        borderTop: '1px solid rgba(212,130,90,0.08)',
        borderBottom: '1px solid rgba(212,130,90,0.08)'
      }}
    >
      <p style={{
        fontFamily: 'var(--sans)',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(212,130,90,0.45)',
        marginBottom: '2rem',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.8s ease'
      }}>
        Ecuador · 2019–2024 · CIE-10 E10–E14
      </p>

      <div style={{
        fontFamily: 'var(--numeric)',
        fontSize: 'clamp(5rem,14vw,10rem)',
        fontWeight: 700,
        lineHeight: 0.92,
        color: 'var(--crisis)',
        letterSpacing: '-0.05em',
        fontVariantNumeric: 'lining-nums tabular-nums'
      }}>
        {muertos.toLocaleString('es-EC')}
      </div>

      <p style={{
        fontFamily: 'var(--sans)',
        fontSize: 'clamp(1rem,2vw,1.25rem)',
        color: 'rgba(245,237,224,0.5)',
        marginTop: '1rem',
        letterSpacing: '0.04em'
      }}>
        personas murieron de diabetes en seis años
      </p>

      <div style={{
        display: 'flex',
        gap: 'clamp(2.5rem,6vw,5rem)',
        marginTop: '4rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: textVisible ? 1 : 0,
        transform: textVisible ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease'
      }}>
        {[
          { num: '~14', label: 'Cada día', desc: 'muertes en promedio', color: 'var(--crisis-light)', tone: 'default' },
          { num: '$0,20', label: 'Por persona', desc: 'al año en insulina', color: 'var(--estado-light)', tone: 'default' },
          { num: '1 de cada 4', label: 'Traslado', desc: 'muere lejos de su comunidad', color: 'var(--terra-light)', tone: 'ratio' }
        ].map(({ num, label, desc, color, tone }) => (
          <div key={num} style={{ textAlign: 'center', maxWidth: '170px' }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,237,224,0.22)', marginBottom: '0.5rem' }}>{label}</p>
            {tone === 'ratio' ? (
              <div style={{ color, display: 'grid', gap: '0.15rem', justifyItems: 'center' }}>
                <div style={{ fontFamily: 'var(--display-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  1 de cada
                </div>
                <div style={{ fontFamily: 'var(--numeric)', fontSize: 'clamp(2.2rem,4.6vw,3.3rem)', fontWeight: 700, lineHeight: 0.84, letterSpacing: '-0.06em' }}>
                  4
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: 'var(--numeric)', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 700, color, lineHeight: 0.92, letterSpacing: '-0.05em' }}>
                {num}
              </div>
            )}
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'rgba(245,237,224,0.33)', marginTop: '0.45rem', lineHeight: 1.45 }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
