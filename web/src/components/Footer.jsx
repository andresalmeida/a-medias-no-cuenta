export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">

          <div className="footer__col">
            <p className="footer__col-title">Sobre este proyecto</p>
            <p>
              "A medias no cuenta" es una historia de datos desarrollada como proyecto final del
              bootcamp del Observatorio Al Dato, en colaboración con Fundación Datalat e Indeciencia.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Investiga qué ocurre cuando la dieta y los hábitos de vida cambian en el campo
              antes de que el sistema de salud llegue a acompañar ese cambio.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <a
                href="https://github.com/andresalmeida/a-medias-no-cuenta"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(212,130,90,0.7)', textDecoration: 'none', borderBottom: '1px solid rgba(212,130,90,0.3)' }}
              >
                Repositorio del proyecto →
              </a>
            </p>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Fuentes de datos</p>
            <ul>
              <li>INEC — Registro Estadístico de Defunciones Generales 2019-2024</li>
              <li>INEC / MSP — series oficiales de mortalidad por diabetes 2013-2018</li>
              <li>ENSANUT 2018 — Encuesta Nacional de Salud y Nutrición</li>
              <li>STEPS 2018 — encuesta nacional de factores de riesgo (MSP)</li>
              <li>SERCOP — API de compras públicas, búsqueda de insulina 2015-2024</li>
              <li>INEC — Censo 2022: NBI y autoidentificación étnica por provincia</li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Metodología</p>
            <ul>
              <li>Mortalidad acumulada 2019-2024 estandarizada por 100.000 hab. (Censo 2022)</li>
              <li>Comparación provincial entre mortalidad, pobreza e inversión pública</li>
              <li>Tendencias y desvíos sobre la trayectoria esperable</li>
              <li>Período alineado: 2019-2024 para defunciones y SERCOP</li>
              <li>Los análisis son de nivel provincial. No permiten inferencias individuales.</li>
              <li>Se advierte posible subregistro en zonas rurales remotas.</li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Limitaciones</p>
            <ul>
              <li>Las relaciones mostradas son asociaciones, no pruebas de causalidad.</li>
              <li>Las señales estadísticas se leen como tendencias y no como conclusiones cerradas.</li>
              <li>El análisis principal es provincial: no se bajó a cantón o parroquia porque el microdato de residencia no lo permite sin introducir sesgos fuertes.</li>
              <li>Subregistro de causa de muerte es mayor en zonas rurales.</li>
              <li>ENSANUT 2018 no incluyó biomarcadores de glucosa; STEPS 2018 solo está disponible como cifra agregada.</li>
            </ul>
            <p style={{ marginTop: '0.75rem', fontStyle: 'italic', color: 'rgba(184,168,152,0.5)' }}>
              El apéndice metodológico completo, los criterios de exclusión de SERCOP y el flujo
              de replicación están documentados en{' '}
              <a
                href="https://github.com/andresalmeida/a-medias-no-cuenta/blob/main/METODOLOGIA.md"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(184,168,152,0.6)', textDecoration: 'none', borderBottom: '1px solid rgba(184,168,152,0.25)' }}
              >
                METODOLOGIA.md
              </a>.
            </p>
          </div>

        </div>

        <div className="footer__bottom">
          <span>Andrés Almeida · Observatorio Al Dato · Fundación Datalat · Indeciencia · Mayo 2026</span>
          <span>Datos: INEC · MSP · SERCOP · Censo 2022</span>
        </div>
      </div>
    </footer>
  )
}
