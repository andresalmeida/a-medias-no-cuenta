import { useInView } from '../hooks/useInView'

function StatReveal({ num, desc, delay = 0, color = 'var(--crisis)', tone = 'default' }) {
  const [ref, inView] = useInView(0.2)
  return (
    <div ref={ref} className="cierre__stat" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(20px)',
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`
    }}>
      <span className={`cierre__num ${tone === 'ratio' ? 'cierre__num--ratio' : ''}`} style={{ color }}>
        {num}
      </span>
      <p className="cierre__desc">{desc}</p>
    </div>
  )
}

export default function Cierre() {
  const [titleRef, titleInView] = useInView(0.2)

  return (
    <section className="cierre">
      <div className="cierre__grid">
        <div className="cierre__stats">
          <StatReveal
            num="25.708"
            desc="muertes por diabetes entre 2019 y 2024"
            delay={0}
            color="var(--terra-light)"
          />

          <StatReveal
            num={<><span className="cierre__ratio-prefix">1 de cada</span><span className="cierre__ratio-value">4</span></>}
            desc="residentes rurales mueren lejos de su comunidad"
            delay={0.35}
            color="var(--crisis-light)"
            tone="ratio"
          />
        </div>

        <div
          ref={titleRef}
          className="cierre__center"
          style={{
            opacity: titleInView ? 1 : 0,
            transition: 'opacity 1.2s ease 0.3s'
          }}
        >
          <p className="cierre__eyebrow">8 / 8 · El cierre</p>
          <h2 className="cierre__title">A medias no cuenta.</h2>
          <p className="cierre__footnote">
            La modernización también se mide en lo que un país alcanza a cuidar a tiempo.
          </p>
          <p className="cierre__seal">
            Ecuador
            <br />
            esta historia también trata de lo que llega tarde
          </p>
        </div>

        <div className="cierre__stats">
          <StatReveal
            num="$0,20"
            desc="en insulina por persona por año durante el período"
            delay={0.18}
            color="var(--estado-light)"
          />
        </div>
      </div>
    </section>
  )
}
