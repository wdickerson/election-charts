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
  mapGroupRef, 
  markerPathRef, 
  setPathString, 
  setLatLngPath, 
  countyPathsRef,
  includeMouseEvents,
) {
  const mapLayer = d3.select(mapGroupRef)
  const markerPath = d3.select(markerPathRef)

  const MAP_BG = '#eff3ef'

  mapLayer.append("rect")
    .attr('width', 1000)
    .attr('height', 1000)
    .attr('fill', MAP_BG)
  
  // let path = d3.path();
  // let latLngPath = [];
  
  // mapLayer.on('mouseup', function() {
  //   path.closePath()
  //   setPathString(path.toString())
  //   setLatLngPath(latLngPath)
  // })
  
  // markerPath.on('mouseup', function() {
  //   path.closePath()
  //   setPathString(path.toString())
  //   setLatLngPath(latLngPath)
  // })
  
  // mapLayer.on('mousedown', function(d) {
  //   const [x, y] = d3.pointer(d);
  //   path.moveTo(x, y);
  //   latLngPath = [];
  // })
  
  // mapLayer.on('mousemove', function(d) {
  //   if (!d.which) return
  //   const [x, y] = d3.pointer(d);
  //   path.lineTo(x, y);
  //   setPathString(path.toString())
  //   latLngPath.push(projection.invert([x, y]))
  // })
  
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
  
  mapLayer.on('mouseup', function() {
    path.closePath()
    setPathString(path.toString())
    setLatLngPath(latLngPath)
  })
  
  markerPath.on('mouseup', function() {
    path.closePath()
    setPathString(path.toString())
    setLatLngPath(latLngPath)
  })
  
  mapLayer.on('mousedown', function(d) {
    const [x, y] = d3.pointer(d);
    path.moveTo(x, y);
    latLngPath = [];
  })
  
  mapLayer.on('mousemove', function(d) {
    if (!d.which) return
    const [x, y] = d3.pointer(d);
    path.lineTo(x, y);
    setPathString(path.toString())
    latLngPath.push(projection.invert([x, y]))
  })


}


function updateFills (countyPaths, latLngPath, year, selectedCounties, setSelectedCounties) {
  if (latLngPath.length < 5) return

  const allSelectedCounties = new Set(selectedCounties)

  const geoJsonObject = {
    type: "Polygon",
    coordinates: [latLngPath],
  }

  countyPaths.attr('fill', function (d) {
    const fips = parseInt(d.properties.GEOID);
    const latLng = projection.invert(d.centroid)
    const contains = d3.geoContains(geoJsonObject, latLng)

    // Why does contains seem backwards?
    if (contains) return d3.select(this).attr('fill');

    const percentDiff = getPercentDiff(fips, year)
    const fill = color(percentDiff)

    if (!contains) {
      allSelectedCounties.add(fips);
    }
    return fill;
  })
  setSelectedCounties(allSelectedCounties)
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
  setPathString,
  selectedCounties,
  setSelectedCounties,
  latLngPath, 
  setLatLngPath, 
  year,
  includeMouseEvents,
}) => {
    const mapGroupRef = useRef()
    const markerPathRef = useRef()
    const countyPathsRef = useRef(true)

    useEffect(() => {
      if (mapGroupRef.current && markerPathRef.current) {
        generateMap(
          mapGroupRef.current, 
          markerPathRef.current, 
          setPathString, 
          setLatLngPath, 
          countyPathsRef,
          includeMouseEvents,
        )
      }
    }, [mapGroupRef, markerPathRef])

    useEffect(() => {
      if (markerPathRef.current) {
        updateMarkerPath(markerPathRef.current, pathString)
      }
    }, [pathString])

    useEffect(() => {
      if (countyPathsRef.current) {
        updateFills(countyPathsRef.current, latLngPath, year, selectedCounties, setSelectedCounties)
      }
    }, [latLngPath])


    return (
      <svg id="svg_map" viewBox="0 0 1000 700">
        <g className="map">
            <g ref={mapGroupRef}></g>
            <path ref={markerPathRef}></path>
        </g>
        <text x='500' y='54' fontSize='58'>{year}</text>
      </svg>
    );

}

export default ElectionMap
