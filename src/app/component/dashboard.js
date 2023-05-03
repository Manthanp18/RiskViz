"use client";
import { useEffect, useState } from "react";

import DataTable from "./Table";
import Chart from "./chart";

import Maps from "./map";
import { useSelector } from "react-redux";

export default function Dashboard({ climateRiskData }) {
  const [year, setYear] = useState("2020");
  const [data, setData] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("map");

  const newData = climateRiskData.slice(1);
  const loadData = async () => {
    setData(newData);
  };
  useEffect(() => {
    // dispatch(increment(newData));
    loadData();
  }, [year]);
  const locationObject = useSelector((state) => state.dataReducer.climateData);
  let mapSelectedYear = useSelector((state) => state.dataReducer.year);
  const selectYears = mapSelectedYear?.toString();

  const updatedData = data.map((item) => {
    return {
      ...item,
      RiskFactors: JSON.parse(item.RiskFactors),
    };
  });
  console.log({ updatedData, data });
  const latLongString = locationObject.Lat + "," + locationObject.Long;
  return (
    <div className="flex flex-col h-screen bg-stone-900 p-2">
      <div className="flex-1 flex  border-b-4 pb-6">
        <div className="h-80 w-1/2 pr-4 border-r-4 ">
          <Maps data={data} />
        </div>
        <div className="w-1/2 mt-11">
          <Chart
            data={data}
            object={locationObject}
            latLongString={latLongString}
            mapSelectedYear={selectYears}
          />
        </div>
      </div>
      <div className="flex-1 mt-5">
        <DataTable
          data={updatedData}
          latLongString={latLongString || ""}
          mapSelectedYear={selectYears || ""}
        />
      </div>
    </div>
  );
}
