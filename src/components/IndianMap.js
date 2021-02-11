import React, { useState, useEffect, useContext } from "react";
import { geoPath, geoConicEqualArea, geoCentroid } from "d3-geo";

import AQIContext from "../context/AQI/AQIContext";

const IndianMap = ({ stateJson, width, height }) => {

  const [pollutionType, setPollutionType] = useState('');
  const [legendText, setLegendText] = useState("Click on any state");

  const aqiContext = useContext(AQIContext);

  const projection = geoConicEqualArea()
    .scale(1100)
    .rotate([-78, 0])
    .center([12, 26]);

  useEffect(() => {
    aqiContext.setGeographies(stateJson);
    aqiContext.getLocalPollutionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateClick = (stateIndex) => {
    // console.log(stateIndex);
    // console.log(aqiContext.geographies[stateIndex].properties.st_nm);
    setLegendText(aqiContext.geographies[stateIndex].properties.st_nm);
  };

  const getProperColorName = (color) => {
    if(color && color[0] === "#") {
      return color.slice(0, -1);
    }
    return color;
  }

  const findColor = (index) => {
    try {
      if(aqiContext.pollutionData && (index in aqiContext.pollutionData) && (aqiContext.pollutionData[index])) {
      
        if(pollutionType === "general") {
          const color = getProperColorName(aqiContext.pollutionData[index].color);
          return color;
        }
  
        const pollutionData = aqiContext.pollutionData[index].aqiParams.filter(data => data.name === pollutionType);
        if(pollutionData.length > 0) {
          const color = getProperColorName(pollutionData[0].color);
          return color;
        }
      }
      return "#ccc";
    }
    catch(err) {
      console.log(err.message, index);
    }
  }

  const getPollutionValue = (index) => {
    try {
      if(aqiContext.pollutionData[index]) {
        if(pollutionType === "general") {
          return aqiContext.pollutionData[index].value;
        }
        const pollutionData = aqiContext.pollutionData[index].aqiParams.filter(data => data.name === pollutionType);
        if(pollutionData.length > 0)
          return pollutionData[0].aqi;
      }
    }
    catch(err) {
      console.log(err.message, index);
    }
  }

  return (
    <>
      {
        aqiContext.loading ? (
          <h2>Loading ..... Might take some time to load all the state's data...</h2>
        ) : (
          <>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <g className="states">
                {
                  aqiContext.geographies.map((d, i) => (
                    <path
                      key={`path-${i}`}
                      d={geoPath().projection(projection)(d)}
                      className="state"
                      // fill={`${geographies[i].properties.pollutionData.color}`}
                      fill={ findColor(i) }
                      stroke="red"
                      strokeWidth={0.5}
                      onClick={() => handleStateClick(i)}
                    />
                  ))
                }
              </g>
              <g className="level">
                {
                  aqiContext.geographies.map((d, i) => (
                    <text 
                      className="label"
                      key={`text-${i}`}
                      x={projection(geoCentroid(d))[0] - 8}
                      y={projection(geoCentroid(d))[1]}
                    >
                      {getPollutionValue(i)}
                    </text>
                  ))
                }
              </g>
              <rect x="30" y={height - height/4} width="200" height="150" stroke="black" fill="transparent" strokeWidth="1.5"/>
              <text x="35"  y={height - height/4 + 30} maxwidth="200" fontFamily="Verdana" fontSize="20" fill="Red">{legendText}</text>
            </svg>
            <div className="btn-group">
              <button className="btn" onClick={() => {
                  aqiContext.reloadAllStatesPollutionData();
                  setPollutionType('general');
                  
                }
              }>
                Reload Pollution Data
              </button>
              <button className="btn" onClick={() => {
                  aqiContext.getAllStatesPollutionData();
                  setPollutionType('general');
                  
                }
              }>
                Get Pollution Data
              </button>
              <button className="btn" onClick={() => {
                  aqiContext.getAllStatesPollutionData();
                  setPollutionType('PM2.5');
                  
                }
              }>
                Get PM2.5 Data
              </button>
              <button className="btn" onClick={() => {
                  aqiContext.getAllStatesPollutionData();
                  setPollutionType('NO2');
                  
                }
              }>
                Get NO2 Data
              </button>
              <button className="btn" onClick={() => {
                  aqiContext.getAllStatesPollutionData();
                  setPollutionType('SO2');
                  
                }
              }>
                Get SO2 Data
              </button>
              <button className="btn" onClick={() => {
                  aqiContext.getAllStatesPollutionData();
                  setPollutionType('O3');
                  
                }
              }>
                Get O3 Data
              </button>
            </div>
          </>
        )
      }
    </>
  );
};

export default IndianMap;
