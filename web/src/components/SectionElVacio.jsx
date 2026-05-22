import { useInView } from '../hooks/useInView'
import BarrasDobles from './charts/BarrasDobles'

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

const BRECHAS = [
  { nombre: 'El Oro',     tasa: '199.4', insulina: '$0.64', pct_desp: '27%' },
  { nombre: 'Esmeraldas', tasa: '187.7', insulina: '$0.55', pct_desp: '28%' },
  { nombre: 'Carchi',     tasa: '147.3', insulina: '$0.55', pct_desp: '22%' },
  { nombre: 'Cotopaxi',   tasa: '104.6', insulina: '$0.48', pct_desp: '26%' }
]

export default function SectionElVacio() {
  return (
    <section className="section section--light">
      <div className="container">

        {/* ── Encabezado a ancho completo ── */}
        <FadeUp>
          <div className="section-label">
            <span className="section-label__num">03</span>
            <span className="section-label__line" style={{ background: 'var(--crisis)' }} />
            <span className="section-label__text">El vacío del Estado</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <h2 className="t-headline" style={{ color: 'var(--text)', marginBottom: '0.75rem', maxWidth: '22ch' }}>
            La insulina no siempre llega donde más se la necesita.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="t-deck t-deck--muted">
            En varias provincias, el peso de la enfermedad y la respuesta pública no avanzan en la misma dirección.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="t-body" style={{ color: 'var(--text)', maxWidth: '68ch', marginBottom: '2rem' }}>
            Al mirar provincia por provincia, la distribución de insulina no sigue con claridad el mapa de las muertes.
            Hay lugares donde la carga es alta y la respuesta pública sigue siendo baja.
            <strong> Ahí se abre la brecha.</strong>
          </p>
        </FadeUp>

        {/* ── Dos columnas equilibradas ── */}
        <div className="two-col" style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>

          {/* Izq: tabla brecha crítica */}
          <FadeUp delay={0.15}>
            <div className="section-ledger">
              <p className="section-ledger__eyebrow">
                4 provincias en zona crítica
              </p>
              <p className="section-ledger__intro">
                Mucha mortalidad, poca insulina y demasiados traslados
              </p>

              <div className="section-ledger__head">
                <span style={{ color: 'var(--text-muted)' }}>Provincia</span>
                <span style={{ color: 'var(--crisis)', textAlign: 'right' }}>Acum./100k</span>
                <span style={{ color: 'var(--estado)', textAlign: 'right' }}>Insulina/cáp.</span>
              </div>

              {BRECHAS.map(p => (
                <div key={p.nombre} className="section-ledger__row">
                  <strong>{p.nombre}</strong>
                  <span style={{ color: 'var(--text)' }}>{p.tasa}</span>
                  <span style={{ color: 'var(--estado)' }}>{p.insulina}</span>
                </div>
              ))}

              <p className="section-ledger__footnote">
                Las cuatro combinan mortalidad acumulada alta con una inversión en insulina por debajo de la mitad mejor cubierta del país.
              </p>
            </div>
          </FadeUp>

          {/* Der: 1 de cada 4 + contexto desplazamiento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <FadeUp delay={0.2}>
              <div>
                <div style={{ color: 'var(--crisis)', display: 'grid', gap: '0.2rem', justifyItems: 'start' }}>
                  <div style={{ fontFamily: 'var(--display-sans)', fontSize: 'clamp(0.92rem,1.3vw,1rem)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.1 }}>
                    1 de cada
                  </div>
                  <div style={{ fontFamily: 'var(--numeric)', fontSize: 'clamp(4.1rem,9vw,6rem)', fontWeight: 700, lineHeight: 0.84, letterSpacing: '-0.06em' }}>
                    4
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'var(--text)', marginTop: '1rem', lineHeight: 1.7, maxWidth: '30ch' }}>
                  residentes rurales que mueren de diabetes lo hacen{' '}
                  <strong>lejos de su lugar de residencia</strong>.
                  Llegan a un hospital urbano cuando la complicación ya desbordó la atención local.
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.7rem', fontStyle: 'italic' }}>
                  INEC Defunciones 2019–2024
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.75, marginTop: '0.25rem' }}>
                La escena se repite: una parroquia sin atención suficiente, una emergencia,
                un traslado, una ciudad que recibe demasiado tarde. Más que una red de cuidado,
                el sistema termina funcionando como una cadena de derivación.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <blockquote className="pull-quote" style={{ fontSize: 'clamp(1rem,1.6vw,1.3rem)', margin: '0.5rem 0 0' }}>
                La enfermedad se complica en el campo. La muerte queda registrada en la ciudad.
              </blockquote>
            </FadeUp>
          </div>
        </div>

        {/* ── Gráfico full-width ── */}
        <FadeUp>
          <div style={{ marginBottom: '0.75rem' }}>
            <p className="chart-title" style={{ color: 'var(--text)' }}>
              Donde la brecha se vuelve visible
            </p>
            <p className="chart-note" style={{ marginBottom: '1rem' }}>
              Las provincias están ordenadas de mayor a menor mortalidad acumulada entre 2019 y 2024. En rojo aparecen los casos donde la carga es alta y la respuesta se queda corta.
            </p>
          </div>
        </FadeUp>

        <div className="chart-shell">
          <BarrasDobles />
        </div>

        <FadeUp>
          <p className="chart-note" style={{ marginTop: '0.75rem' }}>
            Fuentes: INEC Defunciones 2019-2024 (CIE-10 E10-E14); SERCOP API insulina 2019-2024; Censo 2022.
          </p>
        </FadeUp>

      </div>
    </section>
  )
}
