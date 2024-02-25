import React from 'react';
import InteractiveSection from "./InteractiveSection.jsx"
import Footer from "./Footer.jsx"
import allUs2020 from "./static/all_us_2020.svg"
import allUs2000 from "./static/all_us_2000.svg"
import allUsChart from "./static/all_us_chart.svg"
import central2020 from "./static/central_2020.svg"
import central2000 from "./static/central_2000.svg"
import centralChart from "./static/central_chart.svg"


const Home = () => {

    return (
      <>
        <h1>Interactive Map: Has the U.S. become more partisan since 2000?</h1>
        <p>
          <a id='interactive-link' href='#interactive'>
            Jump to the Interactive Map
          </a>
        </p>
        <h2>
          Nationwide, voters are more likely to live in a highly partisan county in 2020 than they were in 2000.
        </h2>
        <p>
          In 2000, 45.3% of voters lived in a <strong>bipartisan county</strong> and 7.5% lived in a <strong>highly partisan county</strong>. In 2020, 32.7% of voters lived in a <strong>bipartisan county</strong> and 19.8% lived in a <strong>highly partisan county</strong>.
        </p>
        <p>
          In this analysis, a <strong>bipartisan county</strong> is one where the Republican and Democrat candidates are separated by less than 15% of the vote. A <strong>highly partisan county</strong> is one where a candidate wins by at least 45% of the vote. For example, a county that voted 55% Democrat and 45% Rebublican is bipartisan. A county that voted 75% Democrat and 25% Republican is highly partisan.
        </p>
        <div className='image-group'>
          <figure className='chart-figure'>
            <figcaption>
              This chart shows the distribution of voters living in bipartisan counties, somewhat partisan counties, and highly partisan counties. The size of the circle reflects the number of voters which live in such a county.
            </figcaption>
            <img className='chart-image' src={allUsChart}></img>
          </figure>
          <figure className='two-map-figure'>
            <figcaption>County-by-county results in 2000 and 2020.</figcaption>
            <img className='map-image' src={allUs2000}></img>
            <img className='map-image' src={allUs2020}></img>
          </figure>
        </div>
        <h2>
          This shift is more dramatic in certain parts of the country.
        </h2>
        <p>
          Using the interactive map, we can complete the same analysis on the region shown below. In 2000, 44.9% of voters in this region lived in a <strong>bipartisan county</strong> and 3.7% lived in a <strong>highly partisan county</strong>. In 2020, 22.1% of voters lived in a <strong>bipartisan county</strong> and 26.8% lived in a <strong>highly partisan county</strong>.
        </p>
        <div className='image-group'>
          <figure className='chart-figure'>
            <figcaption>
              In the selected region, a voter is more likely to live in a highly partisan county than in a bipartisan county.
            </figcaption>
            <img className='chart-image' src={centralChart}></img>
          </figure>
          <figure className='two-map-figure'>
            <figcaption>County-by-county results in 2000 and 2020.</figcaption>
            <img className='map-image' src={central2000}></img>
            <img className='map-image' src={central2020}></img>
          </figure>
        </div>
        <InteractiveSection />
        <Footer />
      </>
    );
}

export default Home

