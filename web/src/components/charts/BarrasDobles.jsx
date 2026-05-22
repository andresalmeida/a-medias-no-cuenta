import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useInView } from '../../hooks/useInView'

const CHART_FONT = 'Outfit, system-ui, sans-serif'
const CHART_LABEL = 'Outfit, system-ui, sans-serif'

export default function BarrasDobles() {
  const svgRef = useRef(null)
  const [data, setData] = useState(null)
  const [ref, inView] = useInView(0.1)

  useEffect(() => {
    d3.csv('./data/barras.csv', d => ({
      provincia: toTitleCase(d.provincia),
      tasa: +d.tasa_mortalidad_100k,
      insulina: +d.insulina_usd_per_capita,
      cuadrante: d.cuadrante
    })).then(raw => {
      const sorted = raw.sort((a, b) => b.tasa - a.tasa)
      setData(sorted)
    })
  }, [])

  useEffect(() => {
    if (!data || !inView) return
    draw(data)
  }, [data, inView])

  function toTitleCase(str) {
    const skip = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y']
    return str.toLowerCase().split(' ').map((w, i) => {
      if (i > 0 && skip.includes(w.toUpperCase())) return w
      return w.charAt(0).toUpperCase() + w.slice(1)
    }).join(' ')
  }

  function draw(rows) {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    const W = container.clientWidth || 900
    const barH = 24
    const gap = 4
    const groupH = barH * 2 + gap + 16
    const margin = { top: 34, right: 128, bottom: 54, left: 162 }
    const H = rows.length * groupH + margin.top + margin.bottom
    const w = W - margin.left - margin.right

    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const maxTasa = d3.max(rows, d => d.tasa)
    const maxIns = d3.max(rows, d => d.insulina)

    // normalize both to 0-1 then scale to chart width (dual conceptual axes)
    const xTasa = d3.scaleLinear().domain([0, maxTasa]).range([0, w * 0.85])
    const xIns = d3.scaleLinear().domain([0, maxIns]).range([0, w * 0.85])

    // Render each province group
    rows.forEach((d, i) => {
      const y = i * groupH
      const isCrisis = d.cuadrante === 'brecha_critica'

      const gRow = g.append('g').attr('transform', `translate(0, ${y})`)

      // Province label
      gRow.append('text')
        .attr('x', -8)
        .attr('y', barH + 3)
        .attr('text-anchor', 'end')
        .attr('font-family', CHART_FONT)
        .attr('font-size', '11.5px')
        .attr('font-weight', isCrisis ? '700' : '400')
        .attr('fill', isCrisis ? '#f08b7c' : 'rgba(245,237,224,0.72)')
        .text(d.provincia)

      // Crisis marker
      if (isCrisis) {
        gRow.append('circle')
          .attr('cx', -140)
          .attr('cy', barH + 2)
          .attr('r', 3)
          .attr('fill', '#f08b7c')
      }

      // Bar: tasa mortalidad
      gRow.append('rect')
        .attr('y', 0)
        .attr('height', barH)
        .attr('width', 0)
        .attr('fill', isCrisis ? '#d85240' : 'rgba(216,82,64,0.48)')
        .attr('rx', 1)
        .transition().duration(900).delay(i * 30).ease(d3.easeCubicOut)
        .attr('width', xTasa(d.tasa))

      gRow.append('text')
        .attr('x', xTasa(d.tasa) + 5)
        .attr('y', barH - 6)
        .attr('font-family', CHART_FONT)
        .attr('font-size', '10px')
        .attr('fill', isCrisis ? '#f08b7c' : 'rgba(245,237,224,0.48)')
        .attr('opacity', 0)
        .text(`${d.tasa}`)
        .transition().delay(i * 30 + 900).duration(300)
        .attr('opacity', 1)

      // Bar: insulina per cápita
      gRow.append('rect')
        .attr('y', barH + gap)
        .attr('height', barH)
        .attr('width', 0)
        .attr('fill', isCrisis ? 'rgba(77,133,149,0.62)' : 'rgba(77,133,149,0.42)')
        .attr('rx', 1)
        .transition().duration(900).delay(i * 30 + 200).ease(d3.easeCubicOut)
        .attr('width', xIns(d.insulina))

      gRow.append('text')
        .attr('x', xIns(d.insulina) + 5)
        .attr('y', barH * 2 + gap - 6)
        .attr('font-family', CHART_FONT)
        .attr('font-size', '10px')
        .attr('fill', 'rgba(118,177,190,0.82)')
        .attr('opacity', 0)
        .text(`$${d.insulina}`)
        .transition().delay(i * 30 + 1100).duration(300)
        .attr('opacity', 1)

      // Separator line
      if (i < rows.length - 1) {
        gRow.append('line')
          .attr('x1', -margin.left)
          .attr('x2', w + margin.right)
          .attr('y1', groupH - 2)
          .attr('y2', groupH - 2)
          .attr('stroke', 'rgba(255,255,255,0.06)')
      }
    })

    // Legend
    const leg = g.append('g').attr('transform', `translate(0, ${rows.length * groupH + 12})`)

    leg.append('rect').attr('width', 12).attr('height', 8).attr('y', 2).attr('fill', '#d85240').attr('rx', 1)
    leg.append('text').attr('x', 17).attr('y', 10).attr('font-size', '10.5px').attr('font-family', CHART_FONT)
      .attr('fill', 'rgba(245,237,224,0.58)').text('Mortalidad acumulada 2019-2024 (por 100.000 hab.)')

    leg.append('rect').attr('x', 0).attr('y', 18).attr('width', 12).attr('height', 8).attr('fill', '#4d8595').attr('rx', 1)
    leg.append('text').attr('x', 17).attr('y', 27).attr('font-size', '10.5px').attr('font-family', CHART_FONT)
      .attr('fill', 'rgba(245,237,224,0.58)').text('Insulina estatal (USD per cápita, 2019-2024)')

    // Legend crisis
    leg.append('circle').attr('cx', 6).attr('cy', 42).attr('r', 3.5).attr('fill', '#f08b7c')
    leg.append('text').attr('x', 17).attr('y', 46).attr('font-size', '10.5px').attr('font-family', CHART_LABEL)
      .attr('fill', 'rgba(240,139,124,0.9)').text('Brecha crítica: más muertes, menos insulina')
  }

  return (
    <div ref={ref} className="chart-wrap">
      <svg ref={svgRef} style={{ width: '100%', overflow: 'visible', display: 'block' }} />
    </div>
  )
}
