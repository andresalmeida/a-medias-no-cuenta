import Hero from './components/Hero'
import SectionElCampo from './components/SectionElCampo'
import SectionLaFractura from './components/SectionLaFractura'
import SectionMapa from './components/SectionMapa'
import ContadorMuertes from './components/ContadorMuertes'
import SectionElVacio from './components/SectionElVacio'
import SectionLosQueResisten from './components/SectionLosQueResisten'
import Cierre from './components/Cierre'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <SectionElCampo />
      <SectionLaFractura />
      <SectionMapa />
      <ContadorMuertes />
      <SectionElVacio />
      <SectionLosQueResisten />
      <Cierre />
      <Footer />
    </>
  )
}
