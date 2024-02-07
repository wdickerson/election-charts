import React, { useState, useMemo, useEffect, useRef } from 'react';

import ElectionMap from "./ElectionMap.jsx"
import Controls from "./Controls.jsx"
import DistributionChart from "./DistributionChart.jsx"
import Legend from "./Legend.jsx"
import Footer from "./Footer.jsx"
import { aggregateByYearAndBucket, determineCircledCountiesNew, DEMO_PATH } from './geoData.js';


const Home = () => {
    const myPathString = useRef('')
    const [pathString, setPathString] = useState('')
    const [latLngPath, setLatLngPath] = useState([])
    const [selectedCounties, setSelectedCounties] = useState(new Set())

    const appendPathString = (newPathString, mouseUp = false) => {
      setPathString(myPathString.current + newPathString);
      if (mouseUp) {
        myPathString.current = myPathString.current + newPathString;
      }
    }

    const clearPathString = () => {
      myPathString.current = '';
      setPathString('');
    }

    const props = {
      pathString,
      appendPathString,
      setLatLngPath,
      selectedCounties,
    }

    const { totalByYear, aggregatedByYearAndBucket } = useMemo(() => (
      aggregateByYearAndBucket(selectedCounties)
    ), [selectedCounties]);

    useEffect(() => {
      const allSelectedCounties = new Set(selectedCounties)
      determineCircledCountiesNew(latLngPath).forEach(fips => allSelectedCounties.add(fips));
      setSelectedCounties(allSelectedCounties)
    }, [latLngPath]);

    return (
      <>
        <div className='big-map-section'>
          <div className='chart-section'>
            <Legend selectedCounties={selectedCounties} totalByYear={totalByYear} aggregatedByYearAndBucket={aggregatedByYearAndBucket} />
            {!!selectedCounties.size && <DistributionChart aggregatedByYearAndBucket={aggregatedByYearAndBucket} />}
          </div>
          <div className='big-map-with-controls'>
            <div className='big-map-with-instructions'>
              <ElectionMap {...props} year="2020" includeMouseEvents />
              <p className='instructions'><strong>Click and draw on the map to select counties!</strong> Or, choose from:</p>
            </div>
            <Controls 
              selectedCounties={selectedCounties} 
              setSelectedCounties={setSelectedCounties}
              clearPathString={clearPathString}
            />
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

