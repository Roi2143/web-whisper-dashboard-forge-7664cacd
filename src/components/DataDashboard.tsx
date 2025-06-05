
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataDashboardProps {
  data: {
    title: string;
    data: Array<{ name: string; price: string; rating: number }>;
  };
}

export const DataDashboard = ({ data }: DataDashboardProps) => {
  // Convert price strings to numbers for charting
  const chartData = data.data.map(item => ({
    ...item,
    priceValue: parseFloat(item.price.replace('$', ''))
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">{data.title}</h3>
      
      {/* Data Table */}
      <Card className="p-4 bg-slate-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-300">Product</th>
                <th className="text-left py-2 text-slate-300">Price</th>
                <th className="text-left py-2 text-slate-300">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-2 text-slate-200">{item.name}</td>
                  <td className="py-2 text-green-400 font-medium">{item.price}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-slate-200">{item.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Price Chart */}
      <Card className="p-4 bg-slate-700/30">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Price Comparison</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                stroke="#374151"
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                stroke="#374151"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="priceValue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
