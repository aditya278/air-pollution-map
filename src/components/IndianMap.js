import React, { useState, useEffect } from "react";
import { geoPath, geoConicEqualArea } from "d3-geo";
import { feature } from "topojson-client";

const IndianMap = ({stateJson, width, height}) => {
  const [geographies, setGeographies] = useState([]);
  
    const projection = geoConicEqualArea()
    .scale(1100)
    .rotate([-78, 0])
    .center([12, 26]);

  useEffect(() => {
      console.log(stateJson);
      setGeographies(feature(stateJson, stateJson.objects.polygons).features);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateClick = stateIndex => {
      const state = geographies[stateIndex];
      console.log(`Clicked on state: ${state.properties.st_nm} and Lat: ${state.properties.lat} | Lon: ${state.properties.lon}`);
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g className="states">
        {
            geographies.map((d, i) => (
            <path
                key={`path-${i}`}
                d={geoPath().projection(projection)(d)}
                className="state"
                fill={`rgba(38,50,56,${(1 / geographies.length) * i})`}
                stroke="red"
                strokeWidth={0.5}
                onClick={() => handleStateClick(i)}
            />
            ))
        }
      </g>
    </svg>
  );
};

export default IndianMap;
