import React, { useState } from 'react';

import {
  STATES,
  ALL_COUNTIES,
  getCountiesForState,
} from './geoData';

const Controls = ({ selectedCounties, setSelectedCounties, setPathString }) => {

  const [allUsSelected, setAllUsSelected] = useState(false);
  const [selectedStates, setSelectedStates] = useState(new Set());

  const selectState = (state) => {
    const countiesInStates = getCountiesForState(state);
    const newSelectedCounties = new Set(selectedCounties)
    const newSelectedStates = new Set(selectedStates)

    if (selectedStates.has(state)) {
      newSelectedStates.delete(state)
      countiesInStates.forEach(county => {
        newSelectedCounties.delete(county);
      })
      setSelectedCounties(newSelectedCounties);
      setSelectedStates(newSelectedStates);
      return;
    }

    countiesInStates.forEach(county => {
      newSelectedCounties.add(county);
    })

    newSelectedStates.add(state);
    setSelectedStates(newSelectedStates);
    setSelectedCounties(newSelectedCounties);
  }

  const selectAllUs = () => {
    const newSelectedCounties = new Set()

    if (allUsSelected) {
      setSelectedCounties(new Set());
      setSelectedStates(new Set());
      setAllUsSelected(false);
      return;
    }

    ALL_COUNTIES.forEach(county => {
      newSelectedCounties.add(county)
    });
    setSelectedCounties(newSelectedCounties);
    setAllUsSelected(true);
  }

  const selectClear = () => {
    setSelectedCounties(new Set());
    setSelectedStates(new Set());
    setAllUsSelected(false);
    setPathString('');
  }


  return (
    <div id='controls-section'>
      <div 
        onClick={selectAllUs} 
        className={`all-us-button ${allUsSelected ? 'state-button-selected' : 'state-button'}`}
      >
        Continental US
      </div>
      {
        STATES.map(state => (
          <div 
            onClick={() => selectState(state)} 
            key={state} 
            className={selectedStates.has(state) ? 'state-button-selected' : 'state-button'}
          >
            {state}
          </div>
        ))
      }
      <div 
        onClick={selectClear} 
        className='all-us-button state-button'
      >
        Clear Map
      </div>
    </div>
  );
};

export default Controls;
