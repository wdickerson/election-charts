import React, { useState } from 'react';

import {
  STATES,
  ALL_COUNTIES,
  HIGHLY_PARTISAN_COUNTIES,
  SOMEWHAT_PARTISAN_COUNTIES,
  BIPARTISAN_COUNTIES,
  getCountiesForState,
} from './geoData';

const Controls = ({ selectedCounties, setSelectedCounties, clearPathString }) => {
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [highlyPartisanSelected, setHighlyPartisanSelected] = useState(false);
  const [somewhatPartisanSelected, setSomewhatPartisanSelected] = useState(false);
  const [biPartisanSelected, setBiPartisanSelected] = useState(false);

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

  const allUsSelected = selectedStates.size == 48;

  const selectAllUs = () => {
    const newSelectedCounties = new Set()
    const newSelectedStates = new Set()

    if (allUsSelected) {
      selectClear();
      return;
    }

    ALL_COUNTIES.forEach(county => {
      newSelectedCounties.add(county)
    });

    STATES.forEach(state => {
      newSelectedStates.add(state)
    });
    setSelectedCounties(newSelectedCounties);
    setSelectedStates(newSelectedStates);
    setHighlyPartisanSelected(true);
    setSomewhatPartisanSelected(true);
    setBiPartisanSelected(true);
  }

  const selectHighlyPartisan = () => {
    const newSelectedCounties = new Set(selectedCounties)
    if (highlyPartisanSelected) {
      HIGHLY_PARTISAN_COUNTIES.forEach(county => {
        newSelectedCounties.delete(county);
      })
      setHighlyPartisanSelected(false);
      setSelectedCounties(newSelectedCounties);
      return;
    }

    HIGHLY_PARTISAN_COUNTIES.forEach(county => {
      newSelectedCounties.add(county)
    });
    setSelectedCounties(newSelectedCounties);
    setHighlyPartisanSelected(true);
  }

  const selectSomewhatPartisan = () => {
    const newSelectedCounties = new Set(selectedCounties)
    if (somewhatPartisanSelected) {
      SOMEWHAT_PARTISAN_COUNTIES.forEach(county => {
        newSelectedCounties.delete(county);
      })
      setSomewhatPartisanSelected(false);
      setSelectedCounties(newSelectedCounties);
      return;
    }

    SOMEWHAT_PARTISAN_COUNTIES.forEach(county => {
      newSelectedCounties.add(county)
    });
    setSelectedCounties(newSelectedCounties);
    setSomewhatPartisanSelected(true);
  }

  const selectBiPartisan = () => {
    const newSelectedCounties = new Set(selectedCounties)
    if (biPartisanSelected) {
      BIPARTISAN_COUNTIES.forEach(county => {
        newSelectedCounties.delete(county);
      })
      setBiPartisanSelected(false);
      setSelectedCounties(newSelectedCounties);
      return;
    }

    BIPARTISAN_COUNTIES.forEach(county => {
      newSelectedCounties.add(county)
    });
    setSelectedCounties(newSelectedCounties);
    setBiPartisanSelected(true);
  }

  const selectClear = () => {
    setSelectedCounties(new Set());
    setSelectedStates(new Set());
    setHighlyPartisanSelected(false);
    setSomewhatPartisanSelected(false);
    setBiPartisanSelected(false);
    clearPathString();
  }

  return (
    <div id='controls-section'>
      <div 
        onClick={selectClear} 
        className='clear-button state-button'
      >
        Clear Map
      </div>
      <div 
        onClick={selectAllUs} 
        className={`all-us-button ${allUsSelected ? 'state-button-selected' : 'state-button'}`}
      >
        Continental US
      </div>
      <div 
        onClick={selectHighlyPartisan} 
        className={`partisan-button ${highlyPartisanSelected ? 'state-button-selected' : 'state-button'}`}
      >
        Highly Partisan Counties
      </div>
      <div 
        onClick={selectSomewhatPartisan} 
        className={`partisan-button ${somewhatPartisanSelected ? 'state-button-selected' : 'state-button'}`}
      >
        Somewhat Partisan Counties
      </div>
      <div 
        onClick={selectBiPartisan} 
        className={`all-us-button ${biPartisanSelected ? 'state-button-selected' : 'state-button'}`}
      >
        Bipartisan Counties
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
    </div>
  );
};

export default Controls;
