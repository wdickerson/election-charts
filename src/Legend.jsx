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

    return (
      <figcaption className='legend'>
        {
          !!totalCounties && (
            <>
              You've selected {totalCounties.toLocaleString()} counties, which had {totalByYear["2020"].toLocaleString()} voters in 2020.
              <strong> {percentBipartisan}% lived in bipartisan counties</strong> and <strong>{percentPartisan}% lived in highly partisan counties. </strong>
              The chart shows how this has changed over time. The area of the circle reflects the number of voters in each category of county.
            </>
          )
        }
      </figcaption>
    );
}

export default Legend

