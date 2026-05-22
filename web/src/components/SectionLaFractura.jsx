import { useInView } from '../hooks/useInView'
import SerieHistorica from './charts/SerieHistorica'

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.15)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>
      {children}
    </div>
  )
}

export default function SectionLaFractura() {
  return (
    <section className="section section--chart">
      <div className="container">

        {/* ── Eyebrow ── */}
        <FadeUp>
          <div className="section-label">
            <span className="section-label__num" style={{ color: 'var(--crisis-light)' }}>02</span>
            <span className="section-label__line" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="section-label__text" style={{ color: 'rgba(245,237,224,0.4)' }}>La fractura</span>
          </div>
        </FadeUp>

        {/* ── Heading ancho completo ── */}
        <FadeUp delay={0.05}>
          <h2 className="t-headline" style={{ color: 'var(--text-light)', marginBottom: '0.75rem', maxWidth: '28ch' }}>
            Cuando más hacía falta, llegó menos.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="t-deck t-deck--light">
            En 2020, la diabetes mató más y el Estado compró menos insulina. Ahí la historia deja de ser abstracta.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="metric-band">
            <div className="metric-band__item">
              <p className="metric-band__label" style={{ color: 'rgba(231,76,60,0.45)' }}>Insulina · 2020</p>
              <div className="metric-band__value" style={{ color: 'var(--crisis-light)' }}>−35%</div>
              <div className="metric-band__desc">
                Menos compras de insulina justo en el año más duro del período
              </div>
            </div>
            <div className="metric-band__item">
              <p className="metric-band__label" style={{ color: 'rgba(58,122,143,0.45)' }}>Muertes · 2020 vs. 2019</p>
              <div className="metric-band__value" style={{ color: 'var(--estado-light)' }}>+24%</div>
              <div className="metric-band__desc">
                Más muertes por diabetes frente al año anterior
              </div>
            </div>
            <div className="metric-band__item">
              <p className="metric-band__label" style={{ color: 'rgba(232,160,122,0.45)' }}>Inversión media · 2019–2024</p>
              <div className="metric-band__value" style={{ color: 'var(--terra-light)', fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>$0,20</div>
              <div className="metric-band__desc">
                En promedio, eso fue lo invertido por persona y por año en insulina
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Texto + hallazgo en dos columnas equilibradas ── */}
        <div className="two-col" style={{ marginBottom: '2.5rem' }}>
          <div>
            <FadeUp delay={0.15}>
              <p className="t-body" style={{ color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                En 2020 murieron <strong style={{ color: 'var(--text-light)' }}>6.129 personas por diabetes</strong>.
                Fue un salto brusco. Ese mismo año, las compras públicas de insulina cayeron{' '}
                <strong style={{ color: '#e74c3c' }}>35%</strong> y tocaron su punto más bajo en cinco años.
                La pandemia tensó el sistema, pero también dejó expuesta una fragilidad previa.
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="t-body" style={{ color: 'var(--text-dim)' }}>
                La baja posterior no debería leerse como una recuperación limpia.
                Parte del daño ya estaba hecho, y en las zonas más apartadas el registro de causa de muerte sigue siendo frágil.
                Tampoco el repunte de 2023 cuenta una historia de mejora sostenida: después del desplome, las compras rebotan de forma irregular y no corrigen la fragilidad de fondo.
              </p>
            </FadeUp>
          </div>

          <div>
            <FadeUp delay={0.2}>
              <div className="callout-note" style={{ color: 'rgba(231,76,60,0.72)', marginBottom: '1.1rem' }}>
                <span className="callout-note__label" style={{ color: 'rgba(231,76,60,0.95)' }}>Hallazgo</span>
                <p className="callout-note__body">
                  La ENSANUT 2018 ya no midió glucosa en sangre con microdato público.
                  En el momento en que la enfermedad empezaba a crecer, el país perdió una forma directa de seguirle el rastro.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.35}>
              <div className="callout-note" style={{ color: 'rgba(58,122,143,0.72)' }}>
                <span className="callout-note__label" style={{ color: 'rgba(58,122,143,0.95)' }}>Sobre el gráfico</span>
                <p className="callout-note__body">
                  Las dos líneas no miden lo mismo, pero sí permiten ver una escena clave:
                  mientras una sube con violencia, la otra cae. Esa divergencia marca la fractura.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* ── Gráfico full-width ── */}
        <FadeUp delay={0.1}>
          <div>
            <p className="chart-title" style={{ color: 'var(--text-light)' }}>
              Dos curvas, un mismo quiebre
            </p>
            <p className="chart-note" style={{ color: 'rgba(184,168,152,0.5)', marginBottom: '1rem' }}>
              La línea sólida sigue las muertes por diabetes. La punteada, las compras de insulina hechas por el Estado.
            </p>
          </div>
        </FadeUp>

        <SerieHistorica />

        <FadeUp>
          <p className="chart-note" style={{ color: 'rgba(184,168,152,0.4)', marginTop: '0.5rem' }}>
            Fuentes: INEC / MSP series oficiales de mortalidad por diabetes 2013-2018; INEC Defunciones Generales microdato 2019-2024 (CIE-10 E10-E14); SERCOP API compras públicas (búsqueda "insulina").
            Muertes 2013-2018 son datos oficiales MSP/INEC reportados en informes; no disponibles como microdato.
          </p>
        </FadeUp>

      </div>
    </section>
  )
}
