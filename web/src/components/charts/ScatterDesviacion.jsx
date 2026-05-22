import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useInView } from '../../hooks/useInView'

const LABEL_ALWAYS = ['GALAPAGOS', 'SANTA ELENA', 'GUAYAS', 'CANAR', 'BOLIVAR', 'SUCUMBIOS', 'LOS RIOS', 'ESMERALDAS']
const CHART_FONT = 'Outfit, system-ui, sans-serif'
const CHART_LABEL = 'Outfit, system-ui, sans-serif'
const LABEL_OFFSETS = {
  GALAPAGOS: [10, 4],
  PICHINCHA: [10, 6],
  CANAR: [10, 4],
  BOLIVAR: [10, 18],
  SUCUMBIOS: [10, 30],
  MANABI: [10, -8],
  'LOS RIOS': [10, -2],
  'SANTO DOMINGO DE LOS TSACHILAS': [10, 8],
  ESMERALDAS: [10, 6],
  LOJA: [10, 4],
  'EL ORO': [10, 6],
  GUAYAS: [10, 4],
  'SANTA ELENA': [12, 4],
}

export default function ScatterDesviacion() {
  const svgRef = useRef(null)
  const [data, setData] = useState(null)
  const [ref, inView] = useInView(0.15)

  useEffect(() => {
    d3.csv('./data/scatter.csv', d => ({
      provincia: d.provincia,
      label: toTitleCase(d.provincia),
      nbi: +d.pct_nbi,
      tasa: +d.tasa_mortalidad_100k,
      esperada: +d.mortalidad_esperada,
      residuo: +d.residuo,
      desviacion: d.desviacion
    })).then(setData)
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
    const H = Math.min(560, W * 0.62)
    const margin = { top: 72, right: 32, bottom: 64, left: 70 }
    const w = W - margin.left - margin.right
    const h = H - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    const nbiExtent = d3.extent(rows, d => d.nbi)
    const xScale = d3.scaleLinear()
      .domain([Math.max(0, nbiExtent[0] - 4), Math.min(100, nbiExtent[1] + 5)])
      .range([0, w])
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(rows, d => d.tasa) + 42])
      .range([h, 0])

    // Grid
    g.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(6).tickSize(-w).tickFormat(''))
      .selectAll('line').attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-dasharray', '3,4')
    g.select('.grid .domain').remove()

    g.append('g').attr('class', 'gridx').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(-h).tickFormat(''))
      .selectAll('line').attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-dasharray', '3,4')
    g.select('.gridx .domain').remove()

    // Header strip inside chart
    const positives = rows.filter(d => d.desviacion === 'positiva').length
    const negatives = rows.filter(d => d.desviacion === 'negativa').length
    const expected = rows.filter(d => d.desviacion === 'esperada').length

    const header = g.append('g').attr('transform', 'translate(0,-48)')
    const summary = [
      { label: 'Resisten más', value: positives, color: '#7ea357' },
      { label: 'Esperadas', value: expected, color: 'rgba(245,237,224,0.55)' },
      { label: 'Mueren más', value: negatives, color: '#d85240' }
    ]

    summary.forEach((item, i) => {
      const x = i * 120
      header.append('circle')
        .attr('cx', x + 6)
        .attr('cy', 4)
        .attr('r', 5)
        .attr('fill', item.color)
      header.append('text')
        .attr('x', x + 18)
        .attr('y', 0)
        .attr('font-family', CHART_LABEL)
        .attr('font-size', '11px')
        .attr('letter-spacing', '0.08em')
        .attr('fill', 'rgba(245,237,224,0.72)')
        .text(`${item.value} ${item.label}`)
    })

    header.append('text')
      .attr('x', w)
      .attr('y', 0)
      .attr('text-anchor', 'end')
      .attr('font-family', CHART_LABEL)
      .attr('font-size', '11px')
      .attr('letter-spacing', '0.08em')
      .attr('fill', 'rgba(232,160,122,0.74)')
      .text('Señal sugerente, no concluyente')

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d => `${d}%`))
      .selectAll('text').attr('fill', 'rgba(245,237,224,0.48)').attr('font-size', '10.5px').attr('font-family', CHART_FONT)

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll('text').attr('fill', 'rgba(245,237,224,0.48)').attr('font-size', '10.5px').attr('font-family', CHART_FONT)

    // Axis labels
    g.append('text')
      .attr('x', w / 2).attr('y', h + 46)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(245,237,224,0.4)').attr('font-size', '10.5px').attr('font-family', CHART_LABEL)
      .attr('letter-spacing', '0.12em')
      .text('% HOGARES CON NBI (NECESIDADES BÁSICAS INSATISFECHAS)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2).attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(245,237,224,0.4)').attr('font-size', '10.5px').attr('font-family', CHART_LABEL)
      .attr('letter-spacing', '0.12em')
      .text('MORTALIDAD ACUMULADA 2019-2024 (POR 100.000 HAB.)')

    // Regression line
    const xSorted = rows.map(d => d.nbi).sort(d3.ascending)
    const regrLine = d3.line()
      .x(d => xScale(d.nbi))
      .y(d => yScale(d.esperada))
      .curve(d3.curveLinear)

    const sortedByNBI = [...rows].sort((a, b) => a.nbi - b.nbi)

    const regPath = g.append('path')
      .datum(sortedByNBI)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(232,160,122,0.56)')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '5,4')
      .attr('d', regrLine)

    const regLen = regPath.node().getTotalLength()
    regPath
      .attr('stroke-dasharray', `${regLen} ${regLen}`)
      .attr('stroke-dashoffset', regLen)
      .transition().duration(1200).ease(d3.easeCubicOut)
      .attr('stroke-dasharray', `5,4`)
      .attr('stroke-dashoffset', 0)

    // Color map
    const colorMap = {
      positiva: '#7ea357',
      negativa: '#d85240',
      esperada: 'rgba(245,237,224,0.3)'
    }

    // Dots
    const dotsG = g.append('g')

    rows.forEach((d, i) => {
      const cx = xScale(d.nbi)
      const cy = yScale(d.tasa)
      const color = colorMap[d.desviacion]
      const isLabeled = LABEL_ALWAYS.includes(d.provincia)

      if (d.desviacion !== 'esperada') {
        dotsG.append('circle')
          .attr('cx', cx).attr('cy', cy)
          .attr('r', 11.5)
          .attr('fill', color)
          .attr('fill-opacity', 0.12)
          .attr('opacity', 0)
          .transition().delay(120 + i * 40).duration(400)
          .attr('opacity', 1)
      }

      dotsG.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', d.desviacion !== 'esperada' ? 7.6 : 5.2)
        .attr('fill', color)
        .attr('fill-opacity', d.desviacion === 'esperada' ? 0.55 : 0.92)
        .attr('stroke', d.desviacion !== 'esperada' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.08)')
        .attr('stroke-width', d.desviacion !== 'esperada' ? 1.2 : 0.8)
        .attr('opacity', 0)
        .transition().delay(200 + i * 40).duration(400)
        .attr('opacity', 1)

      if (isLabeled || d.desviacion !== 'esperada') {
        const [dx, dy] = LABEL_OFFSETS[d.provincia] || [9, 4]
        const labelX = cx + dx
        const labelY = cy + dy

        dotsG.append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('font-family', CHART_FONT)
          .attr('font-size', '10px')
          .attr('font-weight', d.desviacion !== 'esperada' ? '600' : '400')
          .attr('fill', d.desviacion !== 'esperada' ? color : 'rgba(245,237,224,0.42)')
          .attr('opacity', 0)
          .text(d.label)
          .transition().delay(600 + i * 40).duration(400)
          .attr('opacity', 1)
      }
    })

  }

  return (
    <div ref={ref} className="chart-wrap chart-wrap--annotated">
      <svg ref={svgRef} style={{ width: '100%', overflow: 'visible', display: 'block' }} />
      <div className="chart-guide chart-guide--dark" aria-label="Claves de lectura del gráfico">
        <div className="chart-guide__item">
          <span className="chart-guide__sample chart-guide__sample--line" aria-hidden="true"></span>
          <div className="chart-guide__copy">
            <strong>Línea punteada</strong>
            <span>Marca el recorrido que seguirían las provincias si todas se comportaran parecido.</span>
          </div>
        </div>

        <div className="chart-guide__item">
          <span className="chart-guide__sample chart-guide__sample--positive" aria-hidden="true"></span>
          <div className="chart-guide__copy">
            <strong>Debajo de la línea</strong>
            <span>Provincias donde la mortalidad queda por debajo de lo esperable.</span>
          </div>
        </div>

        <div className="chart-guide__item">
          <span className="chart-guide__sample chart-guide__sample--negative" aria-hidden="true"></span>
          <div className="chart-guide__copy">
            <strong>Arriba de la línea</strong>
            <span>Provincias donde la mortalidad se dispara por encima de lo esperable.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
