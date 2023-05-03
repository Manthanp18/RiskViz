"use client";
import React, { useEffect, useState } from "react";

const Table = ({ data, latLongString, mapSelectedYear }) => {
  const groupedLocationData = data.reduce((acc, obj) => {
    const key = obj.Lat + "," + obj.Long;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [yearFilter, setYearFilter] = useState(mapSelectedYear);
  // const [groupedLocationData, setGroupedLocationData] = useState({});
  const [filteredData, setFilteredData] = useState(data);
  const [sortOrder, setSortOrder] = useState("asc");
  const [riskFactorFilter, setRiskFactorFilter] = useState("");

  const [selectedLocation, setSelectedLocation] = useState(latLongString);

  const locations = Object.keys(groupedLocationData);

  useEffect(() => {
    if (latLongString && groupedLocationData[latLongString]) {
      setFilteredData(groupedLocationData[latLongString]);
      setSelectedLocation(latLongString);
    } else if (mapSelectedYear) {
      setYearFilter(mapSelectedYear);
      filterByYear(mapSelectedYear);
    } else if (data.length) {
      // Check if data is not empty
      setFilteredData(data);
    }
  }, [latLongString, mapSelectedYear, data]);

  // sorting function for the Risk Rating column
  function handleLocationChange(event) {
    setSelectedLocation(event);
    setFilteredData(groupedLocationData[event]);
  }
  const filterByYear = (year = "") => {
    setYearFilter(year);
    const filteredData = data.filter((val) => {
      return year === "" || val.Year === year;
    });
    setFilteredData(filteredData);
  };

  const sortByRiskRating = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.RiskRating - b.RiskRating;
      } else {
        return b.RiskRating - a.RiskRating;
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const filterData = () => {
    const filteredData = data.filter(
      (val) =>
        (yearFilter === "" || val.Year === yearFilter) &&
        (riskFactorFilter === "" ||
          val.RiskFactors.some((factor) => factor === riskFactorFilter))
    );
    setFilteredData(filteredData);
    setCurrentPage(1);
  };

  // filtering function for the Year column

  // call the filter function once with an empty string as the parameter value to initialize the filteredData state with all data

  // calculate the index of the last row on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const uniqueYears = [...new Set(data.map((item) => item.Year))];
  // calculate the index of the first row on the current page
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // get the rows for the current page
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Search */}
      <div>
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select
          className="bg-stone-600 p-2 rounded-lg mt-2"
          id="yearFilter"
          name="yearFilter"
          value={yearFilter}
          onChange={(e) => filterByYear(e.target.value)}
        >
          <option value="">All Years</option>
          {uniqueYears.map((val, index) => (
            <option key={index} value={val}>
              {val}
            </option>
          ))}
        </select>
        <label className="ml-2" htmlFor="locationFilter">
          Filter by Location:
        </label>
        <select
          className="bg-stone-600 p-2 rounded-lg mt-2"
          id="locationFilter"
          name="locationFilter"
          value={selectedLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <option value="">All Location</option>
          {locations.map((val, index) => (
            <option key={index} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
      <table className="border border-gray-600 mt-6">
        <thead className="bg-stone-500">
          <tr>
            <th className="w-80 border border-gray-600">Name</th>
            <th className="w-32 border border-gray-600">Latitude</th>
            <th className="w-32 border border-gray-600">Longitude</th>
            <th className="w-32 border border-gray-600">Category</th>
            <th className="w-24 border border-gray-600">
              <div className="flex px-2 items-center justify-center">
                Risk Rating
                <div>
                  <button onClick={sortByRiskRating}>🔼🔽</button>
                </div>
              </div>
            </th>
            <th className="w-58 border border-gray-600">Risk Factors</th>
            <th className="w-32 border border-gray-600">Year</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((val, index) => (
            <tr key={index}>
              <td className="h-40 px-4 border border-gray-600">
                {val.AssetName}
              </td>
              <td className="h-40 px-4 border border-gray-600">{val.Lat}</td>
              <td className="h-40 px-4 border border-gray-600">{val.Long}</td>
              <td className="h-40 px-4 border border-gray-600">
                {val.BusinessCatogary}
              </td>
              <td className="h-40 px-4 border border-gray-600">
                {val.RiskRating}
              </td>
              <td className="h-40 px-4 border border-gray-600">
                {Object.entries(val.RiskFactors).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value}
                  </div>
                ))}
              </td>
              <td className="h-40 px-4 border border-gray-600">{val.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center">
        <div>
          {pageNumbers.map((number, index) => {
            if (
              index === 0 ||
              index === pageNumbers.length - 1 ||
              (index >= currentPage - 2 && index <= currentPage + 2)
            ) {
              // display the first page number, the last page number, and 2 page numbers before and after the current page
              return (
                <button
                  className="bg-stone-600 h-14 w-14 rounded-lg hover:bg-stone-700"
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  style={{ margin: "5px" }}
                >
                  {number}
                </button>
              );
            } else if (index === currentPage - 3 || index === currentPage + 3) {
              // display the ellipsis before and after the page numbers that are not displayed
              return <span key={number}>...</span>;
            } else {
              return null; // hide the other page numbers
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Table;
