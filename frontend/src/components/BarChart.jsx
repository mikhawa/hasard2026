import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function BarChart({ students, title, dataKey }) {
  if (!students || students.length === 0) return null;

  const sorted = [...students].sort((a, b) => b[dataKey] - a[dataKey]);

  const data = {
    labels: sorted.map((s) => `${s.prenom} ${s.nom.charAt(0)}.`),
    datasets: [{
      label: title,
      data: sorted.map((s) => s[dataKey]),
      backgroundColor: '#1E90FF',
    }],
  };

  const options = {
    responsive: true,
    plugins: { title: { display: true, text: title } },
  };

  return <Bar data={data} options={options} />;
}
