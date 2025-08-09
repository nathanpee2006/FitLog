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

async function getWorkoutData() {
  const response = await getWorkoutStatistics();
  return response;
}
const workoutData = await getWorkoutData();
const workoutDates = Object.keys(workoutData);
const workoutValues = Object.values(workoutData);

const labels = workoutDates;

export const data = {
  labels,
  datasets: [
    {
      label: "Volume (kg x sets x reps)",
      data: workoutValues,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export default function Statistics() {
  return <Line options={options} data={data} />;
}
