import { useEffect, useState } from 'react'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const tr = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(20px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`
  })

  return (
    <section className="hero" style={{ justifyContent: 'flex-end' }}>
      <div className="hero__bg" />
      <div className="hero__bg-num">01</div>

      <div className="hero__frame">
        <div className="hero__copy">
          <div className="hero__toprail" style={tr(0)}>
            <p className="hero__eyebrow">
              Proyecto final del bootcamp del Observatorio Al Dato
            </p>
            <span className="hero__kicker">2026</span>
          </div>

          <h1 className="hero__title" style={tr(0.18)}>
            A medias<br />no cuenta
          </h1>

          <p className="hero__sub" style={tr(0.36)}>
            Lo que ocurre cuando la modernización llega antes que la medicina.
          </p>

          <p className="hero__lede" style={tr(0.56)}>
            Entre 2019 y 2024, murieron 25.708 personas de diabetes en Ecuador.
            El Estado invirtió, en promedio, veinte centavos de dólar por persona al año en insulina.
            Lo que sigue es el espacio entre esas dos cifras.
          </p>

          <div className="hero__scroll" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease 1.05s' }}>
            <div className="hero__scroll-line" />
            Desliza para descubrir
          </div>
        </div>

        <div className="hero__side" style={tr(0.72)}>
          <div className="hero__side-note">
            <strong>Hipótesis central</strong>
            En muchas comunidades rurales del Ecuador, los productos llegaron con las carreteras.
            La atención médica, en muchos lugares, sigue tratando de llegar.
          </div>
        </div>
      </div>
    </section>
  )
}
