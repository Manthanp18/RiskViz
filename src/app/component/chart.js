// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useEffect, useRef, useState } from "react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineGraph = ({ data }) => {
//   const [selectedAsset, setSelectedAsset] = useState(
//     "Mcknight, Beasley and Stewart"
//   );
//   const [selectedBusinessCategory, setSelectedBusinessCategory] =
//     useState("Energy");
//   console.log({ selectedAsset });
//   const chartRef = useRef(null);

//   const filterData = () => {
//     let filteredData = data;

//     if (selectedAsset !== "") {
//       filteredData = filteredData.filter(
//         (item) => item.AssetName === selectedAsset
//       );
//     }

//     if (selectedBusinessCategory !== "") {
//       filteredData = filteredData.filter(
//         (item) => item.BusinessCatogary === selectedBusinessCategory
//       );
//     }

//     // Group data by decade, Business Category, and Asset Name
//     const groupedData = filteredData.reduce((acc, item) => {
//       const year = Math.floor(parseInt(item.Year) / 10) * 10;
//       const businessCategory = item.BusinessCatogary;
//       const assetName = item.AssetName;
//       acc[year] = acc[year] || {};
//       acc[year][businessCategory] = acc[year][businessCategory] || {};
//       acc[year][businessCategory][assetName] =
//         acc[year][businessCategory][assetName] || [];
//       acc[year][businessCategory][assetName].push(item);
//       return acc;
//     }, {});

//     // Summarize data for selected Business Category and Asset Name
//     let summarizedData = {};
//     if (selectedBusinessCategory && selectedAsset) {
//       Object.entries(groupedData).forEach(([decade, categories]) => {
//         if (categories[selectedBusinessCategory]) {
//           const data = categories[selectedBusinessCategory][selectedAsset];
//           if (data) {
//             const summedRiskRating = data.reduce(
//               (acc, item) => acc + item.RiskRating,
//               0
//             );
//             const averagedRiskRating = summedRiskRating / data.length;
//             summarizedData[decade] = averagedRiskRating;
//           } else {
//             summarizedData[decade] = 0;
//           }
//         } else {
//           summarizedData[decade] = 0;
//         }
//       });
//     }

//     return summarizedData;
//   };

//   const uniqueAssets = [...new Set(data.map((item) => item.AssetName))];
//   const uniqueBusinessCategories = [
//     ...new Set(data.map((item) => item.BusinessCatogary)),
//   ];

//   const filteredData = filterData();
//   for (let key in filteredData) {
//     if (isNaN(filteredData[key])) {
//       filteredData[key] = 0;
//     }
//   }
//   // console.log({ filteredData });
//   const labels = Object.keys(filteredData).sort();
//   const datasets = [
//     {
//       label: `Risk Rating - ${selectedBusinessCategory} - ${selectedAsset}`,
//       data: labels.map((decade) => filteredData[decade]),
//       backgroundColor: "rgba(0, 0, 255, 0.2)",
//       borderColor: "#4dc9f6",
//       borderWidth: 1,
//     },
//   ];

//   const options = {
//     scales: {
//       y: {
//         min: 0,
//         max: 1,
//       },
//     },
//     plugins: {
//       tooltip: {
//         mode: "index",
//         intersect: false,
//         callbacks: {
//           label: function (context) {
//             const decade = labels[context.dataIndex];
//             const asset = selectedAsset;
//             const businessCategory = selectedBusinessCategory;
//             const riskRating = filteredData[decade];

//             return `${asset} - ${businessCategory} - Risk Rating: ${riskRating} `;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <>
//       <div className="pb-4">
//         <select
//           className="bg-stone-600 p-2 rounded-lg mt-2"
//           value={selectedAsset}
//           onChange={(e) => setSelectedAsset(e.target.value)}
//         >
//           <option value="">All Assets</option>
//           {uniqueAssets.map((asset) => (
//             <option key={asset} value={asset}>
//               {asset}
//             </option>
//           ))}
//         </select>

//         <select
//           className="bg-stone-600 p-2 rounded-lg mt-2 ml-3"
//           value={selectedBusinessCategory}
//           onChange={(e) => setSelectedBusinessCategory(e.target.value)}
//         >
//           <option className="p-2" value="">
//             All Business Categories
//           </option>
//           {uniqueBusinessCategories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>
//       <Line ref={chartRef} data={{ labels, datasets }} options={options} />
//     </>
//   );
// };

// export default LineGraph;

import React, { useState } from "react";
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

const LineChart = ({ data }) => {
  const [selectedAssetName, setSelectedAssetName] = useState("Ware PLC");
  const mapedData = groupDataByYearCategoryAndAssetName(data);
  const uniqueAsset = [...new Set(data.map((item) => item.AssetName))];

  function groupDataByYearCategoryAndAssetName(data) {
    const groupedData = {};

    data.forEach((d) => {
      const year = d.Year;
      const category = d.BusinessCatogary;
      const assetName = d.AssetName;

      if (!groupedData[year]) {
        groupedData[year] = {};
      }

      if (!groupedData[year][category]) {
        groupedData[year][category] = {};
      }

      if (!groupedData[year][category][assetName]) {
        groupedData[year][category][assetName] = {
          RiskRating: [],
          RiskFactors: {},
        };
      }

      groupedData[year][category][assetName].RiskRating.push(
        parseFloat(d.RiskRating)
      );

      const riskFactors = JSON.parse(d.RiskFactors);

      for (const [factor, value] of Object.entries(riskFactors)) {
        if (!groupedData[year][category][assetName].RiskFactors[factor]) {
          groupedData[year][category][assetName].RiskFactors[factor] = 0;
        }
        groupedData[year][category][assetName].RiskFactors[factor] += value;
      }
    });

    return groupedData;
  }
  const labels = Object.keys(mapedData);

  const datasets = [];
  for (const category in mapedData[labels[0]]) {
    const riskRatings = [];
    let sum = 0;

    for (const year in mapedData) {
      const assetData = mapedData[year][category][selectedAssetName];
      if (assetData) {
        const riskRatingArray = assetData.RiskRating;
        const sumOfRiskRatings = riskRatingArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        sum += sumOfRiskRatings;
        riskRatings.push(...riskRatingArray);
      }
    }
    console.log({ riskRatings });
    if (riskRatings.length > 0) {
      datasets.push({
        label: category,
        data: riskRatings,
        borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        fill: false,
      });
    }
  }
  const chartData = {
    labels,
    datasets,
  };
  const option = {
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: "Risk Rating",
          },
        },
        x: {
          title: {
            display: true,
            text: "Year",
          },
        },
      },
    },
  };
  console.log({ mapedData });
  return (
    <div>
      <label htmlFor="yearFilter">Filter by Asset Name:</label>
      <select
        className="bg-stone-600 p-2 rounded-lg mt-2"
        value={selectedAssetName}
        onChange={(e) => setSelectedAssetName(e.target.value)}
      >
        <option value="">All Assets</option>
        {uniqueAsset.map((asset) => (
          <option key={asset} value={asset}>
            {asset}
          </option>
        ))}
      </select>
      <Line data={chartData} options={option} />
    </div>
  );
};

export default LineChart;
