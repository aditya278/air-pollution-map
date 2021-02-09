import React, { useState, useEffect } from "react";
import { geoPath, geoAlbers } from "d3-geo";
import { feature } from "topojson-client";

const IndianMap = ({stateJson, width, height}) => {
  const [geographies, setGeographies] = useState([]);
  
    const projection = geoAlbers()
    .scale(1100)
    .rotate([-77, 0])
    .center([12, 26]);;

  useEffect(() => {
      console.log(stateJson);
      setGeographies(feature(stateJson, stateJson.objects.polygons).features);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            />
            ))
        }
      </g>
    </svg>
  );
};

export default IndianMap;
