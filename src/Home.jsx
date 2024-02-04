import React, { useRef, useEffect, useState, useMemo } from 'react';

import ElectionMap from "./ElectionMap.jsx"
import DistributionChart from "./DistributionChart.jsx"
import Legend from "./Legend.jsx"
import Footer from "./Footer.jsx"
import { aggregateByYearAndBucket } from './geoData.js';


const Home = () => {
    const [pathString, setPathString] = useState('')
    const [latLngPath, setLatLngPath] = useState([])
    const [selectedCounties, setSelectedCounties] = useState(new Set())

    const props = {
      pathString,
      setPathString,
      latLngPath,
      setLatLngPath,
      selectedCounties,
      setSelectedCounties,
    }

    const { totalByYear, aggregatedByYearAndBucket } = useMemo(
      () => aggregateByYearAndBucket(selectedCounties), 
      [selectedCounties],
    );

    return (
      <>
        <div className='big-map-section'>
          <div className='big-map'>
            <ElectionMap {...props} year="2020" includeMouseEvents />
          </div>
          <div className='chart-section'>
            <Legend selectedCounties={selectedCounties} totalByYear={totalByYear} aggregatedByYearAndBucket={aggregatedByYearAndBucket} />
            <DistributionChart aggregatedByYearAndBucket={aggregatedByYearAndBucket} />
          </div>
          <Footer />
        </div>
        <div className='little-maps'>
          <div className='little-map'>
            <ElectionMap {...props} year="2000" />
          </div>
          <div className='little-map'>
            <ElectionMap {...props} year="2004" />
          </div>
          <div className='little-map'>
            <ElectionMap {...props} year="2008" />
          </div>
          <div className='little-map'>
            <ElectionMap {...props} year="2012" />
          </div>
          <div className='little-map'>
            <ElectionMap {...props} year="2016" />
          </div>
          <div className='little-map'>
            <ElectionMap {...props} year="2020" />
          </div>
        </div>
      </>
    );
}

export default Home

