
import * as d3 from "d3";

import rawCounties from "./counties_20m.json"
import rawStates from "./states_20m.json"
import results from "../data/election_results.json"


// Remove Alaska, Hawaii, and Puerto Rico (sorry!!)
const includedCountes = rawCounties.features.filter(feature => {
  return !['AK', 'HI', 'PR'].includes(feature.properties.STUSPS)
})
rawCounties.features = includedCountes

const includedStates = rawStates.features.filter(feature => {
  return !['AK', 'HI', 'PR'].includes(feature.properties.STUSPS)
})
rawStates.features = includedStates


export const color = d3.scaleSequential([100, -100], d3.interpolateRdBu)
export const projection = d3.geoAlbers().fitSize([1000, 700], rawCounties)
export const geoGenerator = d3.geoPath().projection(projection);

// pre-calculate centroids
rawCounties.features.forEach(feature => {
  feature.centroid = geoGenerator.centroid(feature);
})


export const getPercentDiff = (fips, year) => {
  // A positive output represent a Republican advantage.
  // A negative output represent a Democrat advantage.
  const repPercent = results[year][fips]?.REPUBLICAN?.percent
  const demPercent = results[year][fips]?.DEMOCRAT?.percent
  return repPercent - demPercent;
}

export const YEARS = ["2000", "2004", "2008", "2012", "2016", "2020"]


export const STATES = [
  'AL',
  'AZ',
  'AR',
  'CA',
  'CO',  
  'CT', 
  'DE',
  'FL',
  'GA',
  'ID', 
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME', 
  'MD',
  'MA',
  'MI', 
  'MN', 
  'MS', 
  'MO',
  'MT', 
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK', 
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',  
  'TN', 
  'TX',
  'UT',
  'VT',
  'VA',
  'WA', 
  'WV', 
  'WI',
  'WY',
]

export const getCountiesForState = (state) => {
  return rawCounties.features.filter(feature => feature.properties.STUSPS == state).map(d => {
    return parseInt(d.properties.GEOID);
  })
}

export const ALL_COUNTIES = rawCounties.features.map(d => parseInt(d.properties.GEOID));

export const BUCKETS = {
  HIGH_R: "R+45 or more",
  LOW_R: "R+15 to R+45", 
  NEUTRAL: "D+15 to R+15", 
  LOW_D: "D+15 to D+45", 
  HIGH_D: "D+45 or more", 
}


export const BUCKET_COLORS = {
  [BUCKETS.HIGH_R]: color(60),
  [BUCKETS.LOW_R]: color(30),
  [BUCKETS.NEUTRAL]: color(0),
  [BUCKETS.LOW_D]: color(-30),
  [BUCKETS.HIGH_D]: color(-60),
}

export const aggregateByYearAndBucket = (selectedCounties) => {
  const aggregatedByYearAndBucket = {}
  const totalByYear = {}

  YEARS.forEach(year => {
    const countByBuckets = {}
    Object.values(BUCKETS).forEach(label => countByBuckets[label] = 0)

    selectedCounties.forEach(fips => {
      const diff = getPercentDiff(fips, year)
      let bucketLabel = BUCKETS.HIGH_D;

      if (diff >= 45) bucketLabel = BUCKETS.HIGH_R;
      else if (diff >= 15) bucketLabel = BUCKETS.LOW_R;
      else if (diff >= -15) bucketLabel = BUCKETS.NEUTRAL
      else if (diff >= -45) bucketLabel = BUCKETS.LOW_D;

      if (results[year][fips]?.REPUBLICAN.total_votes) {
        countByBuckets[bucketLabel] += results[year][fips]?.REPUBLICAN.total_votes;
      }
    })

    const ratioByBuckets = {}
    const totalCount = Object.values(countByBuckets).reduce((a, b) => a + b, 0);
    Object.values(BUCKETS).forEach(label => ratioByBuckets[label] = countByBuckets[label] / totalCount)

    totalByYear[year] = totalCount;
    aggregatedByYearAndBucket[year] = ratioByBuckets;
  })

  return { totalByYear, aggregatedByYearAndBucket }
}

export { results, rawCounties as counties, rawStates as states }
