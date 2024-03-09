import React, { useRef, useEffect } from 'react';

import * as d3 from "d3";
import {
  counties,
  states,
  color,
  projection,
  geoGenerator,
  getPercentDiff,
} from './geoData.js'

function generateMap(
  svgRef,
  mapGroupRef, 
  appendPathString, 
  setLatLngPath, 
  countyPathsRef,
  includeMouseEvents,
) {
  const svgLayer = d3.select(svgRef)
  const mapLayer = d3.select(mapGroupRef)

  const MAP_BG = '#eff3ef'

  mapLayer.append("rect")
    .attr('width', 1000)
    .attr('height', 1000)
    .attr('fill', MAP_BG)
  
  // Add county borders
  const countyPaths = mapLayer.selectAll('path')
    .data(counties.features)
    .join('path')
    .attr('d', geoGenerator)
    .attr('fill', 'white')
    .attr('stroke', 'lightgray')

  countyPathsRef.current = countyPaths;

  // Add state borders
  mapLayer.append('g').selectAll('path')
    .data(states.features)
    .join('path')
    .attr('d', geoGenerator)
    .attr('fill', 'none')
    .attr('stroke', 'gray')

  // Stop here if you aren't the "main" map
  if (!includeMouseEvents) return;
  let path = d3.path();
  let latLngPath = [];
  
  svgLayer.on('mouseup', function() {
    path.closePath()
    appendPathString(path.toString(), true)
    setLatLngPath(latLngPath)
    path = d3.path();
  })
  
  svgLayer.on('mousedown', function(d) {
    const [x, y] = d3.pointer(d);
    path = d3.path();
    path.moveTo(x, y);
    latLngPath = [projection.invert([x, y])];
  })
  
  svgLayer.on('mousemove', function(d) {
    if (!d.buttons) return
    const [x, y] = d3.pointer(d);
    path.lineTo(x, y);
    appendPathString(path.toString(), false)
    latLngPath.push(projection.invert([x, y]))
  })

  let panning = false
  svgLayer.on('touchstart', function(d) {
    const t = d3.pointers(d, this);
    if (t.length > 1) {
      panning = true;
      return;
    }

    const [x, y] = t[0]
    path = d3.path();
    path.moveTo(x, y);
    latLngPath = [projection.invert([x, y])];
  })

  svgLayer.on('touchmove', function(d) {
    const t = d3.pointers(d, this);
    if (panning) return;
    const [x, y] = t[0]
    latLngPath.push(projection.invert([x, y]))
    path.lineTo(x, y);
    appendPathString(path.toString(), false)
  })

  svgLayer.on('touchend', function(d) {
    const t = d3.pointers(d, this);
    if (panning) {
      if (t.length == 0) {
        panning = false;
      }
    } else {
      path.closePath()
      appendPathString(path.toString(), true)
      setLatLngPath(latLngPath)
      path = d3.path();
    }
  })
}

function updateFillsForCounties (countyPaths, year, stateSelectedCounties) {
  countyPaths.attr('fill', function (d) {
    const fips = parseInt(d.properties.GEOID);
    if (!stateSelectedCounties.has(fips)) return 'white';
    const percentDiff = getPercentDiff(fips, year)
    const fill = color(percentDiff)
    return fill;
  })
}

function updateMarkerPath(markerPathRef, pathString) {
  const markerPath = d3.select(markerPathRef)
  markerPath
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", "none")
    .attr("d", pathString)
}

const ElectionMap = ({
  pathString, 
  appendPathString,
  selectedCounties,
  setLatLngPath, 
  year,
  includeMouseEvents,
}) => {
    const svgRef = useRef()
    const mapGroupRef = useRef()
    const markerPathRef = useRef()
    const countyPathsRef = useRef(true)

    useEffect(() => {
      if (svgRef.current && mapGroupRef.current) {
        generateMap(
          svgRef.current,
          mapGroupRef.current, 
          appendPathString, 
          setLatLngPath, 
          countyPathsRef,
          includeMouseEvents,
        )
      }
    }, [mapGroupRef])

    useEffect(() => {
      if (markerPathRef.current) {
        updateMarkerPath(markerPathRef.current, pathString)
      }
    }, [pathString])

    useEffect(() => {
      if (countyPathsRef.current) {
        updateFillsForCounties(countyPathsRef.current, year, selectedCounties)
      }
    }, [selectedCounties])


    return (
      <svg id="svg_map" ref={svgRef} viewBox="0 0 1000 700">
        <g className="map">
            <g ref={mapGroupRef}></g>
            <path ref={markerPathRef}></path>
        </g>
        <text x='500' y='54' fontSize='58'>{year}</text>
      </svg>
    );

}

export default ElectionMap

