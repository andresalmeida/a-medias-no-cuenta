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
            En varias provincias más pobres aparece una señal inesperada: mortalidad por debajo de lo esperable. Puede ser resistencia. También puede ser que el sistema no vio lo que pasó.
          </p>
        </FadeUp>

        <FadeUp delay={0.18}>
          <p className="t-body section-resistencia__body section-resistencia__intro">
            Si pobreza y mortalidad se movieran siempre juntas, la lectura sería más sencilla.
            Pero ocho provincias no encajan.
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
            <p className="section-resistencia__note-label">Cómo leer esta sección</p>
            <p className="section-resistencia__note-copy">
              No significa que el problema sea menor. Significa que el patrón se rompe. Y que donde se rompe, algo ocurre que todavía no se entiende del todo.
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
                Allí donde todavía persisten dietas más cercanas a la producción local, menos ultraprocesados y una vida físicamente más activa, la transición alimentaria pudo avanzar más lento.
                <strong> En ese caso, la resistencia también sería una forma de vida.</strong>
              </p>
            </div>

            <div className="section-resistencia__hypothesis">
              <p className="section-resistencia__hypothesis-label section-resistencia__hypothesis-label--warning">
                Otra posibilidad
              </p>
              <p className="section-resistencia__hypothesis-copy">
                En las zonas más remotas, la causa de muerte también puede registrarse peor. Si un paciente rural muere en su comunidad sin llegar a un centro hospitalario, la certificación de causa queda en manos de un médico rural que no siempre dispone de historial clínico ni de pruebas diagnósticas recientes. En esos casos, la diabetes puede quedar encubierta bajo causas como "insuficiencia cardíaca" o "causa no determinada".
                <strong> Lo que el dato muestra como menor mortalidad podría ser, en parte, menor capacidad del sistema para ver y nombrar lo que ya ocurrió.</strong>
              </p>
              <p className="section-resistencia__hypothesis-copy" style={{ marginTop: '0.75rem', fontSize: '0.78rem', opacity: 0.7 }}>
                Ambas lecturas no se cancelan: una provincia puede tener dieta más tradicional <em>y</em> subregistro más alto al mismo tiempo. El dato invita a investigar, no a concluir.
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
              La línea punteada marca la trayectoria esperable. Los que se alejan son los que no encajan.
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
