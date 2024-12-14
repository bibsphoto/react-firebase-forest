import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  id: string;
  url: string;
  availability: number;
}

interface AvailabilityChartProps {
  data: ChartData[];
}

export const AvailabilityChart = ({ data }: AvailabilityChartProps) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="url" 
            tick={{ fill: 'currentColor' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: 'currentColor' }}
            domain={[0, 100]}
            label={{ 
              value: 'Disponibilité (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip />
          <Bar dataKey="availability" fill="#4F46E5" name="Disponibilité" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};