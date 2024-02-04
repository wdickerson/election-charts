import React, { useRef, useEffect } from 'react';

import * as d3 from "d3";
import { 
  YEARS,
  BUCKETS,
  BUCKET_COLORS,
} from './geoData';

const height = 400;
const width = 900;
const marginLeft = 220;
const marginBottom = 30;
const marginTop = 30;
const maxRadius = 30;

const x = d3.scaleBand()
    .domain(YEARS)
    .range([marginLeft, width])
    .paddingInner(1)
    .paddingOuter(.45)

const y = d3.scaleBand()
    .domain(Object.values(BUCKETS))
    .range([height - marginBottom, marginTop])
    .paddingInner(1)
    .paddingOuter(.65)

const radius = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, maxRadius])

function drawChart (chartGroup) {
  d3.select(chartGroup).append("g")
    .style("font-size", "22")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  d3.select(chartGroup).append("g")
    .style("font-size", "22")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));
}


function updateCircles (circlesGroup, aggregatedByYearAndBucket) {
  YEARS.forEach(year => {
    d3.select(circlesGroup).selectAll(`circle._${year}`)
      .data(Object.values(BUCKETS))
      .join('circle')
      .attr('class', `_${year}`)
      .attr("cx", x(year))
      .attr("cy", d => y(d))
      .attr("r", d => radius(aggregatedByYearAndBucket[year][d]))
      .attr("fill", d => BUCKET_COLORS[d])
      .attr("stroke-width", '0')

    d3.select(circlesGroup).selectAll(`text._${year}`)
      .data(Object.values(BUCKETS))
      .join('text')
      .attr('class', `_${year}`)
      .attr("x", x(year) + maxRadius)
      .attr("y", d => y(d))
      .attr("dominant-baseline", 'middle')
      .attr("font-size", 16)
      .text(d => {
        const percent = (aggregatedByYearAndBucket[year][d] * 100).toFixed(1);
        if (!isNaN(percent)) return `${percent}%`
      });
  })
}

const DistributionChart = ({
  aggregatedByYearAndBucket,
}) => {
    const chartGroupRef = useRef()
    const circlesGroupRef = useRef()

    useEffect(() => {
      if (chartGroupRef.current) {
        drawChart(chartGroupRef.current)
      }
    }, [chartGroupRef])

    useEffect(() => {
      if (circlesGroupRef.current) {
        updateCircles(circlesGroupRef.current, aggregatedByYearAndBucket)
      }
    }, [circlesGroupRef, aggregatedByYearAndBucket])

    return (
      <svg className='svg-chart' viewBox="0 0 1000 400">
        <g ref={chartGroupRef}></g>
        <g ref={circlesGroupRef}></g>
      </svg>
    );
}

export default DistributionChart

