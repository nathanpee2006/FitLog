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
import { Line } from "react-chartjs-2";
import { getWorkoutStatistics } from "../endpoints/api";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Workout Volume Accumulated in Each Month",
    },
  },
};

export default function Statistics() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Volume (kg x sets x reps)",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const workoutData = await getWorkoutStatistics();
        const workoutDates = Object.keys(workoutData);
        const workoutValues = Object.values(workoutData);

        setChartData({
          labels: workoutDates,
          datasets: [
            {
              ...chartData.datasets[0],
              data: workoutValues,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch workout statistics:", error);
      }
    };

    fetchChartData();
  }, []);

  return <Line options={options} data={chartData} />;
}
