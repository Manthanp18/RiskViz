"use client";
import Map from "./map";
import DataTable from "./Table";
import Chart from "./chart";
import { useEffect, useState } from "react";

export default function Dashboard({ climateRiskData }) {
  const [year, setYear] = useState("2020");
  const [data, setData] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("map");

  const newData = climateRiskData.slice(1);
  const loadData = async () => {
    setData(newData);
  };

  useEffect(() => {
    loadData();
  }, [year]);

  return (
    <div className="flex h-screen">
      <div className="w-1/5 p-4 mt-4">
        <h1 className="text-white text-xl font-bold mb-4">Navigation</h1>
        <button
          className={`block mb-2 py-2 px-4 rounded-lg focus:outline-none ${
            selectedComponent === "map"
              ? "bg-gray-700 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedComponent("map")}
        >
          Map
        </button>
        <button
          className={`block mb-2 py-2 px-4 rounded-lg focus:outline-none ${
            selectedComponent === "chart"
              ? "bg-gray-700 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedComponent("chart")}
        >
          Chart
        </button>
        <button
          className={`block mb-2 py-2 px-4 rounded-lg focus:outline-none ${
            selectedComponent === "datatable"
              ? "bg-gray-700 text-white"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedComponent("datatable")}
        >
          Data Table
        </button>
      </div>
      <div className="w-4/5 p-4">
        {selectedComponent === "map" && <Map data={data} />}
        {selectedComponent === "chart" && <Chart data={data} />}
        {selectedComponent === "datatable" && <DataTable data={data} />}
      </div>
    </div>
  );
}
