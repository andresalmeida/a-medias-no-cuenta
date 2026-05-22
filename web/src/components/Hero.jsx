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
            Cuando la atención llega tarde, la enfermedad ya ganó terreno.
          </p>

          <p className="hero__lede" style={tr(0.56)}>
            Entre 2019 y 2024, la diabetes mató a 25.708 personas en Ecuador.
            Mientras tanto, la insulina comprada por el Estado promedió veinte centavos de dólar por persona al año.
            Esta historia sigue esa distancia: la que separa a muchas comunidades rurales de la atención que necesitaban a tiempo.
          </p>

          <div className="hero__scroll" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease 1.05s' }}>
            <div className="hero__scroll-line" />
            Desliza para descubrir
          </div>
        </div>

        <div className="hero__side" style={tr(0.72)}>
          <div className="hero__side-note">
            <strong>Hipótesis central</strong>
            En buena parte del campo ecuatoriano, los productos llegaron antes que el cuidado.
            La modernización entró por la tienda; la salud pública, en cambio, avanzó con mucha más lentitud.
          </div>
        </div>
      </div>
    </section>
  )
}
