import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useInView } from '../../hooks/useInView'

const CHART_FONT = 'Outfit, system-ui, sans-serif'

// Safe NFD normalization — explicit Unicode range for combining marks
function norm(s) {
  return String(s).toUpperCase().trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function MapaEcuador() {
  const wrapRef    = useRef(null)
  const mainRef    = useRef(null)
  const galapRef   = useRef(null)
  const tooltipRef = useRef(null)
  const [geoData,  setGeoData]  = useState(null)
  const [mortData, setMortData] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [ref, inView] = useInView(0.1)

  useEffect(() => {
    Promise.all([
      d3.json('./data/ecuador_provincias.geojson'),
      d3.csv('./data/barras.csv', d => ({
        provincia: norm(d.provincia),
        tasa:      +d.tasa_mortalidad_100k,
        insulina:  +d.insulina_usd_per_capita,
        cuadrante: d.cuadrante
      }))
    ]).then(([geo, mort]) => {
      setGeoData(geo)
      setMortData(mort)
    })
  }, [])

  useEffect(() => {
    if (!geoData || !mortData || !inView) return
    draw(geoData, mortData)
  }, [geoData, mortData, inView])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const update = () => setIsMobile(el.clientWidth < 760)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function labelCuadrante(c) {
    const m = {
      brecha_critica: 'Brecha critica',
      alta_cobertura: 'Alta cobertura',
      baja_presion:   'Baja presión',
      sobrecobertura: 'Sobrecobertura'
    }
    return m[c] || c
  }

  function showTooltip(event, html) {
    // position: fixed → use clientX/clientY (viewport-relative), NOT pageX/pageY
    d3.select(tooltipRef.current)
      .style('opacity', 1)
      .style('left', `${event.clientX + 14}px`)
      .style('top',  `${event.clientY - 10}px`)
      .html(html)
  }

  function hideTooltip() {
    d3.select(tooltipRef.current).style('opacity', 0)
  }

  function draw(geo, mort) {
    const mortMap = new Map(mort.map(d => [d.provincia, d]))

    const validFeatures = geo.features.filter(f => {
      const n = f.properties.provincia_norm
      return n && n !== 'ISLA'
    })

    const mainland  = validFeatures.filter(f => f.properties.provincia_norm !== 'GALAPAGOS')
    const galapagos = validFeatures.filter(f => f.properties.provincia_norm === 'GALAPAGOS')

    const colorScale = d3.scaleSequentialSqrt()
      .domain([0, d3.max(mort, d => d.tasa)])
      .interpolator(d3.interpolate('#f5ede0', '#7b1212'))

    // ── Mainland ───────────────────────────────────────────────
    {
      const svgEl = mainRef.current
      if (!svgEl) return

      const W = svgEl.parentElement.clientWidth || 680
      const H = isMobile ? W * 1.18 : W * 1.05

      d3.select(svgEl).selectAll('*').remove()
      const svg = d3.select(svgEl)
        .attr('viewBox', `0 0 ${W} ${H}`)
        .attr('width',  W)
        .attr('height', H)

      const proj = d3.geoMercator()
        .fitSize([W, H], { type: 'FeatureCollection', features: mainland })
      const path = d3.geoPath().projection(proj)

      svg.selectAll('path.prov')
        .data(mainland)
        .enter().append('path')
        .attr('class', 'prov')
        .attr('d', path)
        .attr('fill', f => {
          const d = mortMap.get(f.properties.provincia_norm)
          return d ? colorScale(d.tasa) : '#2a1f1a'
        })
        .attr('stroke', '#1a0f08')
        .attr('stroke-width', 0.8)
        .attr('cursor', 'pointer')
        .attr('opacity', 0)
        .on('mousemove', function (event, f) {
          const d    = mortMap.get(f.properties.provincia_norm)
          const name = f.properties.provincia_orig
          showTooltip(event, d
            ? `<strong>${name}</strong><br/>
               Mortalidad acum.: <span style="color:#e74c3c">${d.tasa}</span>/100k<br/>
               Insulina: <span style="color:#3a7a8f">$${d.insulina}</span>/cápita<br/>
               <span style="font-size:10px;opacity:0.6">${labelCuadrante(d.cuadrante)}</span>`
            : `<strong>${name}</strong>`)
        })
        .on('mouseleave', hideTooltip)
        .transition().duration(600).delay((_, i) => i * 18)
        .attr('opacity', 1)

      // Labels on notable provinces
      const LABEL = ['ESMERALDAS','GUAYAS','PICHINCHA','MANABI','SANTA ELENA','CARCHI','TUNGURAHUA','LOJA']
      svg.selectAll('text.lbl')
        .data(mainland.filter(f => LABEL.includes(f.properties.provincia_norm) && (!isMobile || ['GUAYAS', 'ESMERALDAS', 'PICHINCHA', 'SANTA ELENA'].includes(f.properties.provincia_norm))))
        .enter().append('text')
        .attr('class', 'lbl')
        .attr('transform', f => { const c = path.centroid(f); return `translate(${c[0]},${c[1]})` })
        .attr('text-anchor', 'middle')
        .attr('font-family', CHART_FONT)
        .attr('font-size', isMobile ? '7px' : '8px')
        .attr('font-weight', '600')
        .attr('fill', f => {
          const d = mortMap.get(f.properties.provincia_norm)
          return (!d || d.tasa > 150) ? 'rgba(255,255,255,0.9)' : 'rgba(26,15,8,0.8)'
        })
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
        .text(f => {
          const parts = f.properties.provincia_orig.split(' ')
          return parts.length > 2 ? parts[0] : f.properties.provincia_orig
        })
        .transition().delay(900).duration(400).attr('opacity', 1)
    }

    // ── Galápagos inset ────────────────────────────────────────
    {
      const svgEl = galapRef.current
      if (!svgEl || galapagos.length === 0) return

      const W = 120, H = 90
      d3.select(svgEl).selectAll('*').remove()
      const svg = d3.select(svgEl)
        .attr('viewBox', `0 0 ${W} ${H}`)
        .attr('width', W).attr('height', H)

      const proj = d3.geoMercator()
        .fitSize([W - 8, H - 8], { type: 'FeatureCollection', features: galapagos })
      proj.translate([proj.translate()[0] + 4, proj.translate()[1] + 4])
      const path = d3.geoPath().projection(proj)

      svg.append('rect')
        .attr('width', W).attr('height', H)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(245,237,224,0.15)')
        .attr('stroke-width', 1).attr('rx', 2)

      svg.selectAll('path.galap')
        .data(galapagos)
        .enter().append('path')
        .attr('class', 'galap')
        .attr('d', path)
        .attr('fill', f => {
          const d = mortMap.get(f.properties.provincia_norm)
          return d ? colorScale(d.tasa) : '#2a1f1a'
        })
        .attr('stroke', '#1a0f08').attr('stroke-width', 0.8)
        .attr('cursor', 'pointer')
        .on('mousemove', function (event, f) {
          const d = mortMap.get(f.properties.provincia_norm)
          showTooltip(event, d
            ? `<strong>Galápagos</strong><br/>
               Mortalidad acum.: <span style="color:#e74c3c">${d.tasa}</span>/100k<br/>
               Insulina: <span style="color:#3a7a8f">$${d.insulina}</span>/cápita`
            : '<strong>Galápagos</strong>')
        })
        .on('mouseleave', hideTooltip)

      svg.append('text')
        .attr('x', W / 2).attr('y', H - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '7px').attr('font-family', CHART_FONT)
        .attr('fill', 'rgba(245,237,224,0.3)').text('GALÁPAGOS')
    }
  }

  // Static color legend scale (no data dependency)
  const colorLegend = d3.scaleSequentialSqrt()
    .domain([0, 360])
    .interpolator(d3.interpolate('#f5ede0', '#7b1212'))
  const legendStops = [0, 50, 100, 150, 200, 250, 360]
  const sortedByTasa = mortData ? [...mortData].sort((a, b) => b.tasa - a.tasa) : []
  const topThree = sortedByTasa.slice(0, 3)
  const bottomThree = [...sortedByTasa].slice(-3).reverse()
  const critical = mortData ? mortData.filter(d => d.cuadrante === 'brecha_critica') : []
  const titleCase = (value) => String(value).toLowerCase().split(' ').map((word) => {
    if (['de', 'del', 'la', 'las', 'los', 'el', 'y'].includes(word)) return word
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        ref={wrapRef}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1.25rem' : '1rem',
          alignItems: 'flex-start'
        }}
      >

        {/* Main map */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <svg ref={mainRef} style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Sidebar: Galápagos + legend */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '1rem' : '0.75rem',
            paddingTop: isMobile ? '0' : '1rem',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          <svg ref={galapRef} style={{ display: 'block', flexShrink: 0 }} />

          <div style={{ marginTop: isMobile ? '0' : '0.5rem', minWidth: isMobile ? '140px' : '0' }}>
            <p style={{
              fontFamily: CHART_FONT, fontSize: '9px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(245,237,224,0.35)', marginBottom: '0.5rem'
            }}>
              Acumulada / 100.000 hab.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {legendStops.map((stop, i) => (
                <div key={stop} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: 2, flexShrink: 0,
                    background: colorLegend(stop),
                    border: '1px solid rgba(0,0,0,0.2)'
                  }} />
                  <span style={{ fontFamily: CHART_FONT, fontSize: '9px', color: 'rgba(245,237,224,0.4)' }}>
                    {i === legendStops.length - 1 ? '360+' : stop}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {mortData && (
            <div className="map-brief" style={isMobile ? { width: '100%', marginTop: 0 } : undefined}>
              <p className="map-brief__eyebrow">Lectura rápida</p>

              <div className="map-brief__group">
                <p className="map-brief__label">Más altas</p>
                {topThree.map((item) => (
                  <div key={item.provincia} className="map-brief__row">
                    <span>{titleCase(item.provincia)}</span>
                    <strong>{item.tasa}</strong>
                  </div>
                ))}
              </div>

              <div className="map-brief__group">
                <p className="map-brief__label">Más bajas</p>
                {bottomThree.map((item) => (
                  <div key={item.provincia} className="map-brief__row">
                    <span>{titleCase(item.provincia)}</span>
                    <strong>{item.tasa}</strong>
                  </div>
                ))}
              </div>

              <div className="map-brief__group">
                <p className="map-brief__label">Brecha crítica</p>
                <p className="map-brief__note">
                  {critical.map((item) => titleCase(item.provincia)).join(', ')}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip — position:fixed, uses clientX/clientY */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          background: 'rgba(26,15,8,0.96)',
          border: '1px solid rgba(212,130,90,0.35)',
          borderRadius: '3px',
          padding: '0.6rem 0.9rem',
          fontFamily: CHART_FONT,
          fontSize: '12px',
          color: 'rgba(245,237,224,0.85)',
          lineHeight: 1.65,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.12s',
          zIndex: 9999,
          maxWidth: '210px'
        }}
      />
    </div>
  )
}
