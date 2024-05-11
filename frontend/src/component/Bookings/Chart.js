import React from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const BOOKINGS_BUCKETS = {
  Cheap: {
    max: 10,
    min: 0,
  },
  Mid: {
    max: 100,
    min: 10,
  },
  Expensive: {
    max: 1000,
    min: 100,
  },
};
const chart = (props) => {
  const chartData = {labels: [], datasets: []};
  let values = []
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookings = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0); 
    values.push(filteredBookings)
    chartData.labels.push(bucket)
    chartData.datasets.push({
      data: values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        // 'rgba(75, 192, 192, 0.2)',
        // 'rgba(153, 102, 255, 0.2)',
        // 'rgba(255, 159, 64, 0.2)', 
      ],
    })
    values = [...values]
    values[values.length - 1] = 0
  }
  return <Doughnut data={chartData}/>;
};

export default chart;
