import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useInView } from '../../hooks/useInView'

const CHART_FONT = 'Outfit, system-ui, sans-serif'
const CHART_LABEL = 'Outfit, system-ui, sans-serif'

export default function SerieHistorica() {
  const svgRef = useRef(null)
  const [data, setData] = useState(null)
  const [ref, inView] = useInView(0.15)

  useEffect(() => {
    d3.csv('./data/serie.csv', d => ({
      anio: +d.anio,
      muertes: +d.muertes_diabetes,
      insulina: +d.insulina_usd || 0
    })).then(setData)
  }, [])

  useEffect(() => {
    if (!data || !inView) return
    draw(data)
  }, [data, inView])

  function draw(raw) {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    const W = container.clientWidth || 900
    const isMobile = W < 640
    const H = isMobile ? Math.min(460, W * 0.92) : Math.min(440, W * 0.54)
    const margin = isMobile
      ? { top: 82, right: 36, bottom: 54, left: 42 }
      : { top: 34, right: 68, bottom: 54, left: 62 }
    const w = W - margin.left - margin.right
    const h = H - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleLinear().domain([2013, 2024]).range([0, w])
    const yMuertes = d3.scaleLinear()
      .domain([0, d3.max(raw, d => d.muertes) * 1.15])
      .range([h, 0])

    const insulinaData = raw.filter(d => d.insulina > 0)
    const yInsulina = d3.scaleLinear()
      .domain([0, d3.max(insulinaData, d => d.insulina) * 1.2])
      .range([h, 0])
    const data2023 = raw.find(d => d.anio === 2023)

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yMuertes)
          .ticks(5)
          .tickSize(-w)
          .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', 'rgba(255,255,255,0.05)')
      .attr('stroke-dasharray', '4,4')

    g.select('.grid .domain').remove()

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format('d')))
      .selectAll('text')
      .attr('fill', 'rgba(245,237,224,0.48)')
      .attr('font-size', isMobile ? '9.5px' : '11px')
      .attr('font-family', CHART_FONT)

    g.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)')

    // Y axis muertes (left)
    g.append('g')
      .call(d3.axisLeft(yMuertes).ticks(5).tickFormat(d => d3.format(',')(d)))
      .selectAll('text')
      .attr('fill', 'rgba(231,76,60,0.9)')
      .attr('font-size', isMobile ? '9px' : '10.5px')
      .attr('font-family', CHART_FONT)

    // Y axis insulina (right)
    g.append('g')
      .attr('transform', `translate(${w},0)`)
      .call(d3.axisRight(yInsulina).ticks(5).tickFormat(d => `$${d3.format('.1s')(d)}`))
      .selectAll('text')
      .attr('fill', 'rgba(88,151,166,0.92)')
      .attr('font-size', isMobile ? '9px' : '10.5px')
      .attr('font-family', CHART_FONT)

    // Axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', isMobile ? -28 : -44)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(231,76,60,0.72)')
      .attr('font-size', isMobile ? '9px' : '10.5px')
      .attr('font-family', CHART_LABEL)
      .attr('letter-spacing', '0.12em')
      .text(isMobile ? 'MUERTES' : 'MUERTES POR DIABETES')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', w + (isMobile ? 34 : 52))
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(88,151,166,0.72)')
      .attr('font-size', isMobile ? '9px' : '10.5px')
      .attr('font-family', CHART_LABEL)
      .attr('letter-spacing', '0.12em')
      .text(isMobile ? 'INSULINA (USD)' : 'COMPRAS INSULINA (USD)')

    // ── Anotación 2020: el cruce crítico ──
    const x2020 = xScale(2020)
    g.append('line')
      .attr('x1', x2020).attr('x2', x2020)
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', 'rgba(232,184,75,0.36)')
      .attr('stroke-dasharray', '4,4')

    // Caja de anotación 2020
    const ann2020X = isMobile ? Math.max(4, x2020 - 112) : x2020 - 166
    const ann2020Y = isMobile ? -64 : 4
    g.append('rect')
      .attr('x', ann2020X).attr('y', ann2020Y)
      .attr('width', isMobile ? 108 : 164).attr('height', isMobile ? 48 : 54)
      .attr('fill', 'rgba(192,57,43,0.14)')
      .attr('stroke', 'rgba(231,76,60,0.32)')
      .attr('stroke-width', 0.8)
      .attr('rx', 2)

    g.append('text')
      .attr('x', ann2020X + 10).attr('y', ann2020Y + 16)
      .attr('fill', '#f08b7c').attr('font-size', isMobile ? '8.5px' : '10px')
      .attr('font-family', CHART_LABEL).attr('font-weight', '500')
      .text('2020: muertes +24%')

    g.append('text')
      .attr('x', ann2020X + 10).attr('y', ann2020Y + 31)
      .attr('fill', 'rgba(245,237,224,0.68)').attr('font-size', isMobile ? '8px' : '9px')
      .attr('font-family', CHART_FONT)
      .text(isMobile ? 'insulina: mínimo' : 'insulina comprada: mínimo histórico')

    g.append('text')
      .attr('x', ann2020X + 10).attr('y', ann2020Y + (isMobile ? 42 : 46))
      .attr('fill', 'rgba(88,151,166,0.86)').attr('font-size', isMobile ? '8px' : '9px')
      .attr('font-family', CHART_FONT)
      .text('↓ 35% respecto a 2019')

    // ── Anotación 2023: repunte irregular ──
    if (data2023) {
      const x2023 = xScale(2023)
      g.append('text')
        .attr('x', x2023 - (isMobile ? 2 : 8)).attr('y', yInsulina(data2023.insulina) - (isMobile ? 10 : 8))
        .attr('text-anchor', isMobile ? 'middle' : 'end')
        .attr('fill', 'rgba(44,95,110,0.56)').attr('font-size', isMobile ? '7px' : '8px')
        .attr('font-family', CHART_FONT).attr('font-style', 'italic')
        .text(isMobile ? '2023 repunta' : '2023 repunta, pero no corrige la caída de fondo')
    }

    // Line muertes
    const lineMuertes = d3.line()
      .x(d => xScale(d.anio))
      .y(d => yMuertes(d.muertes))
      .curve(d3.curveMonotoneX)

    const pathMuertes = g.append('path')
      .datum(raw)
      .attr('fill', 'none')
      .attr('stroke', '#d85240')
      .attr('stroke-width', 2.8)
      .attr('d', lineMuertes)

    const totalLengthM = pathMuertes.node().getTotalLength()
    pathMuertes
      .attr('stroke-dasharray', `${totalLengthM} ${totalLengthM}`)
      .attr('stroke-dashoffset', totalLengthM)
      .transition().duration(1800).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0)

    // Area muertes (subtle fill)
    const areaMuertes = d3.area()
      .x(d => xScale(d.anio))
      .y0(h)
      .y1(d => yMuertes(d.muertes))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(raw)
      .attr('fill', 'url(#gradMuertes)')
      .attr('d', areaMuertes)
      .attr('opacity', 0)
      .transition().delay(800).duration(1000)
      .attr('opacity', 1)

    const defs = svg.append('defs')
    const gradM = defs.append('linearGradient')
      .attr('id', 'gradMuertes')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', h + margin.top)

    gradM.append('stop').attr('offset', '0%').attr('stop-color', '#d85240').attr('stop-opacity', 0.16)
    gradM.append('stop').attr('offset', '100%').attr('stop-color', '#d85240').attr('stop-opacity', 0)

    // Line insulina
    const lineInsulina = d3.line()
      .x(d => xScale(d.anio))
      .y(d => yInsulina(d.insulina))
      .curve(d3.curveMonotoneX)

    const pathIns = g.append('path')
      .datum(insulinaData)
      .attr('fill', 'none')
      .attr('stroke', '#4d8595')
      .attr('stroke-width', 2.4)
      .attr('stroke-dasharray', '7,4')
      .attr('d', lineInsulina)
      .attr('opacity', 0)

    pathIns.transition().delay(600).duration(1400).ease(d3.easeCubicOut)
      .attr('opacity', 1)

    // Dots muertes
    g.selectAll('.dot-m')
      .data(raw)
      .enter().append('circle')
      .attr('cx', d => xScale(d.anio))
      .attr('cy', d => yMuertes(d.muertes))
      .attr('r', d => d.anio === 2020 ? 6.5 : 3.8)
      .attr('fill', d => d.anio === 2020 ? '#f08b7c' : '#d85240')
      .attr('stroke', '#1e1614')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .transition().delay(1600).duration(400)
      .attr('opacity', 1)

    // Legend
    const legend = g.append('g').attr('transform', isMobile ? `translate(0, ${h + 18})` : `translate(${w - 182}, ${h - 62})`)

    legend.append('line')
      .attr('x1', 0).attr('x2', 20).attr('y1', 6).attr('y2', 6)
      .attr('stroke', '#d85240').attr('stroke-width', 2.8)
    legend.append('text')
      .attr('x', 26).attr('y', 10)
      .attr('fill', 'rgba(245,237,224,0.8)')
      .attr('font-size', isMobile ? '9px' : '10px')
      .attr('font-family', CHART_FONT)
      .text('Muertes por diabetes')

    legend.append('line')
      .attr('x1', 0).attr('x2', 20).attr('y1', 26).attr('y2', 26)
      .attr('stroke', '#4d8595').attr('stroke-width', 2.4)
      .attr('stroke-dasharray', '7,4')
    legend.append('text')
      .attr('x', 26).attr('y', 30)
      .attr('fill', 'rgba(245,237,224,0.8)')
      .attr('font-size', isMobile ? '9px' : '10px')
      .attr('font-family', CHART_FONT)
      .text('Compras insulina (USD)')
  }

  return (
    <div ref={ref} className="chart-wrap">
      <svg ref={svgRef} style={{ width: '100%', overflow: 'visible', display: 'block' }} />
    </div>
  )
}
