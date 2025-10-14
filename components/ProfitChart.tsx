'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { PriceScenario } from '@/types';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProfitChartProps {
  scenarios: PriceScenario[];
  recommendedPrice: number;
}

export default function ProfitChart({ scenarios, recommendedPrice }: ProfitChartProps) {
  const data = {
    labels: scenarios.map((s) => formatCurrency(s.price)),
    datasets: [
      {
        label: 'Expected Profit',
        data: scenarios.map((s) => s.expectedProfit),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: scenarios.map((s) =>
          Math.abs(s.price - recommendedPrice) < 0.01 ? 8 : 4
        ),
        pointBackgroundColor: scenarios.map((s) =>
          Math.abs(s.price - recommendedPrice) < 0.01 ? 'rgb(220, 38, 38)' : 'rgb(14, 165, 233)'
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Profit: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
