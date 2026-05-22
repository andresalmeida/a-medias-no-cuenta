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
            Hay un dato que obliga a mirar dos veces.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="t-deck t-deck--light section-resistencia__deck">
            En varias provincias más pobres aparece una señal inesperada: mortalidad por debajo de lo esperable. Puede hablar tanto de protección como de ausencia de registro.
          </p>
        </FadeUp>

        <FadeUp delay={0.18}>
          <p className="t-body section-resistencia__body section-resistencia__intro">
            Si la pobreza y la mortalidad caminaran siempre de la mano, el dibujo sería más simple.
            Pero aquí aparecen provincias que no encajan del todo en esa lógica.
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
                <p className="section-resistencia__definition-caption">No es una absolución del problema. Es una alerta para leer mejor el mapa.</p>
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

        <FadeUp delay={0.46}>
          <div className="section-resistencia__note">
            <p className="section-resistencia__note-label">Cómo leer esta sección</p>
            <p className="section-resistencia__note-copy">
              No significa que el problema desaparezca. Señala los lugares donde el patrón se rompe y donde vale la pena mirar qué protege o qué falta.
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
                En las zonas más remotas, la causa de muerte también puede registrarse peor. Lo que aparece como menos diabetes podría ser, en parte, menos capacidad institucional para verla y nombrarla.
                <strong> A veces, lo que falta no es la enfermedad sino la capacidad de registrarla.</strong>
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
              La línea punteada marca la trayectoria esperable. Los puntos que se alejan de ella son los que merecen una segunda lectura.
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
