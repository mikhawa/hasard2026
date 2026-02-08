import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ stats }) {
  if (!stats) return null;

  const data = {
    labels: ['Tres bien', 'Bien', 'Pas bien', 'Absent'],
    datasets: [{
      data: [stats.vgood, stats.good, stats.nogood, stats.absent],
      backgroundColor: ['#1E90FF', '#BA55D3', '#DC143C', '#ADFF2F'],
    }],
  };

  return (
    <div style={{ maxWidth: 350, margin: '0 auto' }}>
      <Pie data={data} />
    </div>
  );
}
