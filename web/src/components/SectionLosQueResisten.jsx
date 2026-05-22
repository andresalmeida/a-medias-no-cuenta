import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import ScatterDesviacion from './charts/ScatterDesviacion'

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.12)
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

const POSITIVAS = ['Bolívar', 'Cañar', 'Sucumbíos', 'Manabí', 'Los Ríos', 'Santo Domingo', 'Galápagos', 'Pichincha']
const NEGATIVAS = ['Santa Elena', 'Guayas', 'El Oro', 'Esmeraldas', 'Loja']

// 24 provincias — orden mezclado para distribuir los colores uniformemente
const DOTS = [
  { id: 'guayas',      type: 'negative' },
  { id: 'bolivar',     type: 'positive' },
  { id: 'azuay',       type: 'neutral'  },
  { id: 'santaelena',  type: 'negative' },
  { id: 'canar',       type: 'positive' },
  { id: 'chimborazo',  type: 'neutral'  },
  { id: 'eloro',       type: 'negative' },
  { id: 'sucumbios',   type: 'positive' },
  { id: 'carchi',      type: 'neutral'  },
  { id: 'esmeraldas',  type: 'negative' },
  { id: 'manabi',      type: 'positive' },
  { id: 'cotopaxi',    type: 'neutral'  },
  { id: 'loja',        type: 'negative' },
  { id: 'losrios',     type: 'positive' },
  { id: 'imbabura',    type: 'neutral'  },
  { id: 'stodomingo',  type: 'positive' },
  { id: 'morona',      type: 'neutral'  },
  { id: 'galapagos',   type: 'positive' },
  { id: 'orellana',    type: 'neutral'  },
  { id: 'pichincha',   type: 'positive' },
  { id: 'pastaza',     type: 'neutral'  },
  { id: 'elnapo',      type: 'neutral'  },
  { id: 'tungurahua',  type: 'neutral'  },
  { id: 'zamora',      type: 'neutral'  },
]

function DotStrip() {
  const [ref, inView] = useInView(0.25)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (inView && !active) setActive(true)
  }, [inView, active])

  return (
    <div ref={ref} style={{ padding: '1.75rem 0 0.25rem' }}>
      <div style={{ position: 'relative', height: '80px' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          height: '1px', background: 'rgba(245,237,224,0.07)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          {DOTS.map((dot, i) => (
            <div
              key={dot.id}
              style={{
                width:  dot.type === 'neutral' ? 6 : 8,
                height: dot.type === 'neutral' ? 6 : 8,
                borderRadius: '50%',
                flexShrink: 0,
                background:
                  dot.type === 'positive' ? 'rgba(107,143,62,0.85)' :
                  dot.type === 'negative' ? 'rgba(192,57,43,0.85)' :
                  'rgba(245,237,224,0.14)',
                animation: active && dot.type !== 'neutral'
                  ? `dotfloat-${dot.type} 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s forwards`
                  : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,237,224,0.2)', marginTop: '0.75rem' }}>
        24 provincias
      </p>
    </div>
  )
}

export default function SectionLosQueResisten() {
  return (
    <section className="section section--teal">
      <div className="container">
        <FadeUp>
          <div className="section-label">
            <span className="section-label__num" style={{ color: 'var(--terra)' }}>04</span>
            <span className="section-label__line" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="section-label__text" style={{ color: 'rgba(245,237,224,0.42)' }}>Los que resisten</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <h2 className="t-headline" style={{ color: 'var(--text-light)', marginBottom: '0.75rem', maxWidth: '32ch' }}>
            El mapa no cuadra.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="t-deck t-deck--light section-resistencia__deck">
            En la mayoría de provincias, ser más pobre significa morir más de diabetes. Pero en ocho, ese patrón no se cumple. Algo las protege. Nadie sabe exactamente qué.
          </p>
        </FadeUp>

        <FadeUp delay={0.18}>
          <p className="t-body section-resistencia__body section-resistencia__intro">
            Bolívar es una de las provincias más pobres del Ecuador. Sus índices de necesidades básicas insatisfechas superan el promedio nacional. Y sin embargo, su mortalidad por diabetes cae por debajo de lo que sus condiciones harían prever. No es la única.
          </p>
        </FadeUp>

        <FadeUp delay={0.28}>
          <div className="section-resistencia__definition">
            <div className="section-resistencia__definition-sheet">
              <div className="section-resistencia__definition-head">
                <p className="section-resistencia__definition-kicker">Cómo se rompe el patrón</p>
                <p className="section-resistencia__definition-title">Desviación positiva</p>
              </div>
              <div className="section-resistencia__definition-body">
                <p className="section-resistencia__definition-copy">
                  Hay provincias donde la mortalidad observada cae por debajo de lo que su nivel de pobreza haría prever.
                  A eso le llamamos <span className="section-resistencia__term">desviación positiva</span>: una señal
                  de que el patrón entre pobreza, enfermedad y respuesta institucional no se repite igual en todo el país.
                </p>
                <p className="section-resistencia__definition-caption">El dato señala una anomalía. No la explica.</p>
              </div>
            </div>
          </div>
        </FadeUp>

        <div className="section-resistencia__compare">
          <FadeUp delay={0.34}>
            <article className="section-resistencia__ledger section-resistencia__ledger--positive">

              <div className="section-resistencia__ledger-head">
                <span className="section-resistencia__ledger-number">8</span>
                <div>
                  <p className="section-resistencia__ledger-kicker">Provincias que resisten</p>
                  <p className="section-resistencia__ledger-sub">Más de lo esperado</p>
                </div>
              </div>
              <p className="section-resistencia__places">{POSITIVAS.join(' · ')}</p>
            </article>
          </FadeUp>

          <div className="section-resistencia__compare__divider" aria-hidden="true" />

          <FadeUp delay={0.4}>
            <article className="section-resistencia__ledger section-resistencia__ledger--negative">
              <div className="section-resistencia__ledger-head">
                <span className="section-resistencia__ledger-number">5</span>
                <div>
                  <p className="section-resistencia__ledger-kicker">Provincias que mueren</p>
                  <p className="section-resistencia__ledger-sub">Más de lo esperado</p>
                </div>
              </div>
              <p className="section-resistencia__places">{NEGATIVAS.join(' · ')}</p>
            </article>
          </FadeUp>
        </div>

        <DotStrip />

        <FadeUp delay={0.46}>
          <div className="section-resistencia__note">
            <div className="section-resistencia__note-header">
              <span className="section-resistencia__note-kicker">Límite del dato</span>
              <span className="section-resistencia__note-rule" />
            </div>
            <p className="section-resistencia__note-copy">
              No significa que el problema sea menor. Significa que algo protege. Y que los registros de defunciones, solos, no alcanzan para nombrarlo.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid-2col-inline section-resistencia__hypotheses">
            <div className="section-resistencia__hypothesis">
              <p className="section-resistencia__hypothesis-label section-resistencia__hypothesis-label--positive">
                Una posibilidad
              </p>
              <p className="section-resistencia__hypothesis-copy">
                Hay comunidades donde el almuerzo todavía viene de la huerta, no del supermercado. Donde caminar varios kilómetros es parte del día. Donde la transición alimentaria llegó más tarde o encontró más resistencia.
                <strong> Si eso es lo que protege, entonces lo que el dato llama anomalía estadística es, en realidad, una forma de vivir que todavía no ha cambiado del todo.</strong>
              </p>
            </div>

            <div className="section-resistencia__hypothesis">
              <p className="section-resistencia__hypothesis-label section-resistencia__hypothesis-label--warning">
                Otra posibilidad
              </p>
              <p className="section-resistencia__hypothesis-copy">
                Pero hay otra lectura. En las zonas más remotas, la muerte llega antes que el diagnóstico. Un paciente que muere en su comunidad, sin haber llegado a un hospital, queda en manos de un médico sin historial, sin pruebas recientes, sin certeza. La causa se escribe con lo que hay. A veces figura como insuficiencia cardíaca. A veces como causa no determinada.
                <strong> La diabetes, en ese caso, no muere menos. Sencillamente, no aparece.</strong>
              </p>
              <p className="section-resistencia__hypothesis-copy" style={{ marginTop: '0.75rem', fontSize: '0.78rem', opacity: 0.7 }}>
                Las dos lecturas coexisten. Una provincia puede tener dieta más tradicional <em>y</em> subregistro más alto al mismo tiempo. El dato no resuelve esa ambigüedad. Solo señala dónde vale la pena ir a buscar.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="section-resistencia__agenda">
            <div className="section-resistencia__agenda-head">
              <p className="section-resistencia__agenda-eyebrow">Agenda de investigación</p>
              <p className="section-resistencia__agenda-question">
                ¿Qué están haciendo bien?
              </p>
              <p className="section-resistencia__agenda-lead">
                Si ocho provincias se apartan del patrón, la tarea ya no es solo contarlas. Es entender qué las protege antes de que esa protección desaparezca.
              </p>
            </div>

            <div className="section-resistencia__agenda-body">
              <p className="section-resistencia__agenda-copy">
                Es la pregunta que el mapa abre y los datos no pueden responder todavía. Las provincias que salen por debajo del patrón (Bolívar, Cañar, Sucumbíos) comparten algo. Puede ser la dieta. Puede ser el tejido comunitario. Puede ser que el sistema de salud llegó más tarde y, con él, también la transición alimentaria. Probablemente, algo de todo eso a la vez, en proporciones que nadie ha medido.
              </p>
              <p className="section-resistencia__agenda-copy">
                Lo que sí está claro es que ese algo protege. Y que en lugar de esperar a que esa protección se erosione, como ya ocurrió con los patrones alimentarios en décadas anteriores, habría que entender de qué está hecha, antes de que deje de estarlo.
              </p>
              <p className="section-resistencia__agenda-coda">
                Con datos abiertos y seis años de defunciones, la señal ya apareció. Eso habla del dato. Lo que sigue es una pregunta de prioridades.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div>
            <p className="chart-title" style={{ color: 'var(--text-light)' }}>
              Donde el patrón se rompe
            </p>
            <p className="chart-note" style={{ color: 'rgba(184,168,152,0.5)', marginBottom: '1rem' }}>
              La línea punteada es lo que el modelo predice. Los puntos que se alejan son los que la historia no termina de explicar.
            </p>
          </div>
        </FadeUp>

        <ScatterDesviacion />

        <FadeUp>
          <p className="chart-note" style={{ color: 'rgba(184,168,152,0.4)', marginTop: '0.5rem' }}>
            Fuentes: INEC Defunciones 2019-2024; Censo 2022 NBI y etnia por provincia.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
