import { useInView } from '../hooks/useInView'

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.15)
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
      }}
    >
      {children}
    </div>
  )
}

export default function SectionElCampo() {
  return (
    <section className="section section--light">
      <div className="container">

        <FadeUp>
          <div className="section-label">
            <span className="section-label__num">01</span>
            <span className="section-label__line" style={{ background: 'var(--terra)' }} />
            <span className="section-label__text">El campo que resistía</span>
          </div>
        </FadeUp>

        <div className="two-col">
          <div>
            <FadeUp delay={0.1}>
              <h2 className="t-headline" style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>
                Durante siglos, la dieta andina fue un escudo
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="t-body" style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>
                Durante mucho tiempo, comer en el campo significó comer de la propia tierra:
                papa, maíz, quinua, fréjol. Esa dieta cotidiana, hecha de productos cercanos
                y poco procesados, ayudó a contener enfermedades que hoy avanzan con más facilidad.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="t-body" style={{ color: 'var(--text)', marginBottom: '2rem' }}>
                En muchas comunidades indígenas de la Sierra centro y de la Amazonía,
                ese equilibrio se sostuvo durante generaciones. No porque el riesgo no existiera,
                sino porque la forma de vivir todavía lo contenía.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <p className="t-body" style={{ color: 'var(--text)' }}>
                Luego algo cambió. No llegó primero un médico ni una política pública:
                llegaron las carreteras, los mercados, las bebidas azucaradas,
                la comida rápida barata. La vida urbana entró al campo como consumo,
                no como cuidado.
              </p>
            </FadeUp>
          </div>

          <div>
            <FadeUp delay={0.15}>
              <div className="highlight-box editorial-card" style={{ marginTop: '0' }}>
                <p className="editorial-card__eyebrow" style={{ color: 'var(--terra)' }}>
                  ENSANUT 2018 + STEPS 2018
                </p>

                <div className="editorial-metric">
                  <div className="editorial-metric__value" style={{ color: 'var(--crisis)' }}>62%</div>
                  <div className="editorial-metric__copy">
                    de adultos rurales vivían con sobrepeso u obesidad en 2018,
                    una señal de que la transición alimentaria ya estaba instalada
                  </div>
                </div>

                <div className="editorial-metric">
                  <div className="editorial-metric__value" style={{ color: 'var(--terra)' }}>7,1%</div>
                  <div className="editorial-metric__copy">
                    de adultos presentaba glucosa elevada en ayunas
                    <span style={{ display: 'block', fontStyle: 'italic', marginTop: '0.2rem' }}>(MSP, encuesta STEPS 2018)</span>
                  </div>
                </div>

                <p className="paper-highlight-note" style={{ marginTop: '1rem' }}>
                  La ENSANUT 2018 ya no incluyó biomarcadores de glucosa en sangre, a diferencia de la edición anterior. Cuando el problema empezaba a crecer, el país dejó de medirlo con la misma precisión.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.35}>
              <div className="quote-banner">
                <blockquote className="pull-quote" style={{ color: 'var(--terra)', borderColor: 'var(--terra)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', marginTop: '0' }}>
                  "La ciudad entró al campo como consumo mucho antes de entrar como cuidado."
                </blockquote>
              </div>
            </FadeUp>
          </div>
        </div>

      </div>
    </section>
  )
}
