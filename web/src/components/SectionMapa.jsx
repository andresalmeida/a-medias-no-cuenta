import { useInView } from '../hooks/useInView'
import MapaEcuador from './charts/MapaEcuador'

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.12)
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

export default function SectionMapa() {
  return (
    <section className="section section--dark">
      <div className="container">

        <FadeUp>
          <div className="section-label">
            <span className="section-label__num" style={{ color: 'var(--crisis-light)' }}>02b</span>
            <span className="section-label__line" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="section-label__text" style={{ color: 'rgba(245,237,224,0.35)' }}>La geografía de la crisis</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <h2 className="t-headline" style={{ color: 'var(--text-light)', marginBottom: '0.75rem', maxWidth: '32ch' }}>
            La crisis no cae igual sobre todo el país.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="t-deck t-deck--light">
            Entre Santa Elena y Sucumbíos hay una distancia que no se explica solo por geografía. También habla de trayectorias desiguales de cuidado.
          </p>
        </FadeUp>

        {/* ── Confrontación de extremos ── */}
        <FadeUp delay={0.12}>
          <div className="extreme-compare">
            <div className="extreme-compare__item">
              <p className="extreme-compare__label" style={{ color: 'rgba(192,57,43,0.55)' }}>Mayor mortalidad</p>
              <div className="extreme-compare__value" style={{ color: 'var(--crisis)', fontFamily: 'var(--numeric)', fontWeight: 700 }}>359</div>
              <p className="extreme-compare__unit">acumuladas / 100k hab.</p>
              <p className="extreme-compare__place">Santa Elena</p>
              <p className="extreme-compare__desc">Costa sur — tasa más alta del país</p>
            </div>

            <div className="extreme-compare__divider" />

            <div className="extreme-compare__item">
              <p className="extreme-compare__label" style={{ color: 'rgba(107,143,62,0.55)' }}>Menor mortalidad</p>
              <div className="extreme-compare__value" style={{ color: 'var(--resistencia)', fontFamily: 'var(--numeric)', fontWeight: 700 }}>13</div>
              <p className="extreme-compare__unit">acumuladas / 100k hab.</p>
              <p className="extreme-compare__place">Sucumbíos</p>
              <p className="extreme-compare__desc">Amazonía — tasa más baja del país</p>
            </div>
          </div>
        </FadeUp>

        {/* ── Narrativa ── */}
        <div className="two-col" style={{ marginBottom: '2.5rem' }}>
          <FadeUp delay={0.2}>
              <p className="t-body" style={{ color: 'var(--text-dim)' }}>
              La franja costera concentra las tasas más altas. En cambio, varias provincias amazónicas
              y del centro-sur aparecen con niveles comparativamente menores. El mapa no cuenta una sola historia:
              cuenta ritmos distintos de cambio.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="t-body" style={{ color: 'var(--text-dim)' }}>
              Donde la dieta cambió antes y el acceso a servicios no creció al mismo paso,
              el impacto parece más duro. Lo que se ve aquí no es solo una enfermedad distribuida en el territorio,
              sino una desigualdad acumulada.
            </p>
          </FadeUp>
        </div>

        <FadeUp>
          <div style={{ marginBottom: '0.75rem' }}>
            <p className="chart-title" style={{ color: 'var(--text-light)' }}>
              Dónde se muere más
            </p>
            <p className="chart-note" style={{ color: 'rgba(184,168,152,0.45)' }}>
              El mapa compara la mortalidad acumulada por diabetes entre provincias entre 2019 y 2024. La columna lateral resume extremos y zonas críticas; el cursor añade detalle.
            </p>
          </div>
        </FadeUp>

        <MapaEcuador />

        <FadeUp>
          <p className="chart-note" style={{ color: 'rgba(184,168,152,0.4)', marginTop: '0.75rem' }}>
            El color muestra la carga acumulada; la columna lateral ordena la lectura sin depender del hover. ·
            Fuentes: INEC Defunciones Generales 2019-2024 (CIE-10 E10-E14); Censo 2022; SERCOP API insulina 2019-2024.
          </p>
        </FadeUp>

      </div>
    </section>
  )
}
