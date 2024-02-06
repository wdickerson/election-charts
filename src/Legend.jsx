import React from 'react';
import { BUCKETS } from './geoData.js'

const Legend = ({
  selectedCounties,
  totalByYear,
  aggregatedByYearAndBucket,
}) => {
    const totalCounties = selectedCounties.size;

    const ratioPartisanR = aggregatedByYearAndBucket["2020"][BUCKETS.HIGH_R];
    const ratioPartisanD = aggregatedByYearAndBucket["2020"][BUCKETS.HIGH_D];
    const percentPartisan = ((ratioPartisanR + ratioPartisanD) * 100).toFixed(1);
    const percentBipartisan = (aggregatedByYearAndBucket["2020"][BUCKETS.NEUTRAL] * 100).toFixed(1);

    if (!totalCounties) {
      return (
        <div className='legend'>
          <p className='description top-line'>
            In 2020, Americans are more likely to live in a highly partisan county than they were in 2000. 
            Use the interactive map to visualize this shift.
          </p>
        </div>
      )
    }

    return (
      <div className='legend'>
        <p className='top-line'>You've selected {totalCounties.toLocaleString()} counties, which had {totalByYear["2020"].toLocaleString()} voters in 2020.</p>
        <p>Of them, <strong>{percentBipartisan}% lived in bipartisan counties</strong> and <strong>{percentPartisan}% lived in highly partisan counties.</strong> </p>
        <p className='top-line'>The chart shows how this has changed over time.</p>
        <p>The area of the circle is proportionate to the number of voters. </p>
      </div>
    );
}

export default Legend

