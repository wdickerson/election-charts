
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

export const determineCircledCountiesNew = (latLngPath) => {
  if (latLngPath.length < 5) return []

  const geoJsonObject = {
    type: "Polygon",
    coordinates: [latLngPath],
  }

  return rawCounties.features.filter(feature => {
    const antartica = [-135, 82];
    const latLng = projection.invert(feature.centroid)

    // d3.geoContains behaves "backwards" for clockwise paths
    const logicIsInverted = d3.geoContains(geoJsonObject, antartica)
    const contains = !d3.geoContains(geoJsonObject, latLng)
    return logicIsInverted ? contains : !contains;
  }).map(feature => parseInt(feature.properties.GEOID))
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

const getBucketLabel = (diff) => {
  if (diff >= 45) return BUCKETS.HIGH_R;
  else if (diff >= 15) return BUCKETS.LOW_R;
  else if (diff >= -15) return BUCKETS.NEUTRAL
  else if (diff >= -45) return BUCKETS.LOW_D;
  else return BUCKETS.HIGH_D;
}

export const aggregateByYearAndBucket = (selectedCounties) => {
  const aggregatedByYearAndBucket = {}
  const totalByYear = {}

  YEARS.forEach(year => {
    const countByBuckets = {}
    Object.values(BUCKETS).forEach(label => countByBuckets[label] = 0)

    selectedCounties.forEach(fips => {
      const diff = getPercentDiff(fips, year)
      const bucketLabel = getBucketLabel(diff);
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

export const HIGHLY_PARTISAN_COUNTIES = ALL_COUNTIES.filter(fips => {
  const diff = getPercentDiff(fips, '2020');
  const bucketLabel = getBucketLabel(diff);
  return bucketLabel == BUCKETS.HIGH_R || bucketLabel == BUCKETS.HIGH_D;
})

export const SOMEWHAT_PARTISAN_COUNTIES = ALL_COUNTIES.filter(fips => {
  const diff = getPercentDiff(fips, '2020');
  const bucketLabel = getBucketLabel(diff);
  return bucketLabel == BUCKETS.LOW_R || bucketLabel == BUCKETS.LOW_D;
})

export const BIPARTISAN_COUNTIES = ALL_COUNTIES.filter(fips => {
  const diff = getPercentDiff(fips, '2020');
  const bucketLabel = getBucketLabel(diff);
  return bucketLabel == BUCKETS.NEUTRAL;
})


export const DEMO_PATH = 'M656.0860595703125,194.4461669921875L656.0860595703125,195.76893615722656L654.7633056640625,195.76893615722656L650.7949829101562,202.38275146484375L644.18115234375,210.31932067871094L636.2445678710938,222.2241973876953L623.0169677734375,244.71116638183594L601.852783203125,291.00787353515625L584.6568603515625,338.6273498535156L572.751953125,378.31024169921875L562.1698608398438,416.67034912109375L562.1698608398438,457.676025390625L562.1698608398438,481.4857482910156L571.42919921875,518.5231323242188L583.3340454101562,548.9466552734375L596.5617065429688,571.4336547851562L612.4348754882812,587.3067626953125L621.6942138671875,588.6295776367188L638.89013671875,580.6929931640625L658.7315673828125,562.17431640625L678.572998046875,539.6873168945312L702.3827514648438,496.0361328125L722.2241821289062,448.4166564941406L739.4201049804688,411.3793029785156L750.002197265625,375.6647033691406L763.2298583984375,337.3045654296875L775.1347045898438,292.33062744140625L780.42578125,253.9705047607422L779.10302734375,231.48353576660156L769.8436889648438,210.31932067871094L759.2615356445312,195.76893615722656L748.679443359375,181.21853637695312L735.4518432617188,173.28195190429688L718.2559204101562,169.3136749267578L695.7689208984375,169.3136749267578L678.572998046875,169.3136749267578L667.9909057617188,178.57301330566406L657.4088134765625,187.8323516845703Z'