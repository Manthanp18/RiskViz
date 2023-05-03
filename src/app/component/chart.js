import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, object, mapSelectedYear }) => {
  let { Lat, Long } = object ?? { Lat: undefined, Long: undefined };

  // Set default Lat value if it is undefined
  Lat = Lat === undefined ? "45.40008" : Lat;
  Long = Long === undefined ? "-73.58248" : Long;

  console.log({ Lat });
  // Filter data by Lat and Long
  const filteredData = data.filter(
    (item) => item.Lat === Lat && item.Long === Long
  );
  // Group data by unique Year values and calculate average Risk Rating and Risk Factors
  const groupedData = filteredData.reduce((acc, curr) => {
    if (!acc[curr.Year]) {
      acc[curr.Year] = {
        filteredData: [],
        RiskRatingSum: 0,
        RiskFactorsSum: {},
      };
    }
    acc[curr.Year].filteredData.push(curr);
    acc[curr.Year].RiskRatingSum += parseFloat(curr.RiskRating);
    const riskFactors = JSON.parse(curr.RiskFactors);
    Object.keys(riskFactors).forEach((factor) => {
      if (!acc[curr.Year].RiskFactorsSum[factor]) {
        acc[curr.Year].RiskFactorsSum[factor] = 0;
      }
      acc[curr.Year].RiskFactorsSum[factor] += parseFloat(riskFactors[factor]);
    });
    return acc;
  }, {});

  console.log({ groupedData });
  // Calculate average Risk Rating and Risk Factors for each Year
  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Risk Rating",
        data: [],
        borderColor: "red",
        fill: false,
      },
      {
        label: "Risk Factors",
        data: [],
        borderColor: "blue",
        fill: false,
      },
    ],
  };
  console.log({ groupedData });
  console.log({ filteredData });
  Object.keys(groupedData).forEach((year) => {
    const yearData = groupedData[year];
    const riskRatingAvg = yearData.RiskRatingSum / yearData.filteredData.length;
    chartData.datasets[0].data.push(riskRatingAvg.toFixed(2));
    console.log({ riskRatingAvg });
  });

  console.log({ groupedData });
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: "Average Risk Rating of Location",
        },
        min: 0,
        max: 1,
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const datasetIndex = tooltipItem.datasetIndex;
          const index = tooltipItem.index;
          if (datasetIndex === 0) {
            return `Risk Rating: ${data.datasets[datasetIndex].data[index]}`;
          }
          return "";
        },
      },
    },
  };

  return (
    <div className="h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
