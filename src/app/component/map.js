"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import Pin from "./pin";
import { increment, year } from "../redux/feature/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";

const initialViewState = {
  latitude: 40,
  longitude: -100,
  zoom: 2.5,
};

const Maps = ({ data }) => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const groupedLocationData = data.reduce((acc, obj) => {
    const key = obj.Lat + "," + obj.Long;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  console.log({ popupInfo });

  const filteredData = useMemo(() => {
    if (!selectedYear) {
      return groupedLocationData;
    }
    const filtered = {};
    for (const [key, arr] of Object.entries(groupedLocationData)) {
      const filteredArr = arr.filter(
        (obj) => Math.floor(obj.Year / 10) * 10 === selectedYear
      );
      if (filteredArr.length > 0) {
        filtered[key] = filteredArr;
      }
    }
    return filtered;
  }, [groupedLocationData, selectedYear]);

  useEffect(() => {
    dispatch(year(selectedYear));
  }, [selectedYear]);

  const getMarkerColor = (riskRating) => {
    if (riskRating >= 0.8) {
      return "red";
    } else if (riskRating >= 0.5) {
      return "orange";
    } else {
      return "green";
    }
  };

  return (
    <div className="h-full py-4">
      <label htmlFor="year-select" className="mr-2 mb-2">
        Select Year:
      </label>
      <select
        id="year-select"
        className="bg-stone-600 p-2 rounded-lg mb-2"
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

      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      >
        {Object.entries(filteredData)
          .filter(([, arr]) => arr.length > 0) // filter out empty arrays
          .map(([coords, arr]) => {
            const { Lat, Long } = arr[0]; // get Lat and Long from first object in array
            return (
              <Marker
                key={coords}
                latitude={parseFloat(Lat)}
                longitude={parseFloat(Long)}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(arr[0]);
                  dispatch(increment(arr[0]));
                }}
                onMouseEnter={() => {
                  setPopupInfo(arr[0]);
                }}
                onMouseLeave={() => {
                  setPopupInfo(null);
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
              Asset Name: {popupInfo.AssetName}
            </div>
            <div className="text-slate-950">
              Business Category: {popupInfo.BusinessCategory}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default Maps;
