"use client";
import React, { useCallback, useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import Pin from "./pin";
import "mapbox-gl/dist/mapbox-gl.css";

const initialViewState = {
  latitude: 40,
  longitude: -100,
  zoom: 2.5,
};

function Maps({ data }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const groupedLocationData = data.reduce((acc, obj) => {
    const key = obj.Lat + "," + obj.Long;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
  // const locations = Object.keys(groupedLocationData);
  // const [selectedDecade, setSelectedDecade] = useState(2050);
  const [popupInfo, setPopupInfo] = useState(null);

  const filteredData = useMemo(() => {
    if (!selectedYear) {
      return groupedLocationData;
    }
    const filtered = {};
    for (const [key, arr] of Object.entries(groupedLocationData)) {
      const filteredArr = arr.filter((obj) => obj.Year === selectedYear);
      if (filteredArr.length > 0) {
        filtered[key] = filteredArr;
      }
    }
    return filtered;
  }, [groupedLocationData, selectedYear]);

  console.log({ filteredData });

  const getMarkerColor = (riskRating) => {
    if (riskRating >= 0.8) {
      return "red";
    } else if (riskRating >= 0.5) {
      return "orange";
    } else {
      return "green";
    }
  };
  // console.log({ popupInfo });

  return (
    <div className="h-2/3 w-full pt-4">
      <div>
        <label htmlFor="year-select" className="mr-2">
          Select Year:
        </label>
        <select
          id="year-select"
          className="border rounded p-1"
          value={selectedYear ?? ""}
          onChange={(e) =>
            setSelectedYear(e.target.value ? parseInt(e.target.value) : null)
          }
        >
          <option value="">All Years</option>
          {Array.from(new Set(data.map((obj) => obj.Year))).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      >
        {Object.entries(filteredData)
          .filter(([, arr]) => arr.length > 0) // filter out empty arrays
          .map(([coords, arr]) => {
            const { Lat, Long } = arr[0]; // get Lat and Long from first object in array
            console.log(arr[0]);
            return (
              <Marker
                key={coords}
                latitude={parseFloat(Lat)}
                longitude={parseFloat(Long)}
                anchor="bottom"
                onClick={(e) => {
                  // If we let the click event propagates to the map, it will immediately close the popup
                  // with `closeOnClick: true`
                  e.originalEvent.stopPropagation();
                  setPopupInfo(arr[0]);
                }}
              >
                <Pin
                  size={20}
                  color={getMarkerColor(parseFloat(arr[0].RiskRating))}
                />
              </Marker>
            );
          })}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.Long)}
            latitude={Number(popupInfo.Lat)}
            onClose={() => setPopupInfo(null)}
          >
            <div className="text-slate-950">
              Asset Name :{popupInfo.AssetName},
            </div>
            <div className="text-slate-950">
              Business Catogary:
              {popupInfo.BusinessCatogary}
            </div>

            {/* <img width="100%" src={popupInfo.image} /> */}
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default Maps;

const data = {
  "42.83f34,-80.382297": [
    {
      AssetName: "Jones Ltd",
      Lat: "42.8334",
      Long: "-80.38297",
      BusinessCatogary: "Manufacturing",
      RiskRating: "0.69",
      Year: 2030,
    },
  ],
  "42.8vf3234,-80.38v297": [
    {
      AssetName: "Jones Ltd",
      Lat: "42.8334",
      Long: "-80.38297",
      BusinessCatogary: "Manufacturing",
      RiskRating: "0.69",
      Year: 2030,
    },
  ],
  "42.8vf334,-80.382vf27": [
    {
      AssetName: "Jones Ltd",
      Lat: "42.8334",
      Long: "-80.38297",
      BusinessCatogary: "Manufacturing",
      RiskRating: "0.69",
      Year: 2030,
    },
  ],
  "42.83334,-80.38227": [
    {
      AssetName: "Jones Ltd",
      Lat: "42.8334",
      Long: "-80.38297",
      BusinessCatogary: "Manufacturing",
      RiskRating: "0.69",
      Year: 2030,
    },
  ],
};
