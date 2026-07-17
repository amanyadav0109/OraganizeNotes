import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { getDashboardStats } from "../services/dashboardService";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DashboardChart() {

  const [stats,setStats]=useState({

    totalSubjects:0,
    totalNotes:0,
    totalPinned:0,
    dueToday:0

  });

  useEffect(()=>{

    load();

  },[]);

  const load=async()=>{

    const data=await getDashboardStats();

    setStats(data);

  }

  const chartData={

    labels:[
      "Subjects",
      "Notes",
      "Pinned",
      
    ],

    datasets:[

      {

        data:[
          stats.totalSubjects,
          stats.totalNotes,
          stats.totalPinned,
          
        ],

        backgroundColor:[

          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444"

        ],

        borderWidth:1

      }

    ]

  };

  return (
  <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">

    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 dark:text-white">
      📊 Dashboard Statistics
    </h2>

    <div className="w-full flex justify-center">

      <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">

        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color:
                    document.documentElement.classList.contains("dark")
                      ? "#fff"
                      : "#374151",
                  padding: 20,
                  boxWidth: 15,
                  font: {
                    size: 14,
                  },
                },
              },
            },
          }}
        />

      </div>

    </div>

  </div>
);

}

export default DashboardChart;