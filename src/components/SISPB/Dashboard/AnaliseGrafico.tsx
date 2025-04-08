
import { LineChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

interface DadosBoleto {
  mes: string;
  pendentes: number;
  pagos: number;
}

interface AnaliseGraficoProps {
  dados: DadosBoleto[];
}

export default function AnaliseGrafico({ dados }: AnaliseGraficoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01] duration-300">
      <div className="flex items-center mb-4">
        <LineChart className="h-6 w-6 text-[#00c6a7] mr-2" />
        <h2 className="text-lg font-bold text-gray-800">Evolução das Despesas</h2>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dados}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fill: '#333', fontSize: 12 }} />
            <YAxis tick={{ fill: '#333', fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, ""]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="pendentes" name="Pendentes" fill="#facc15" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pagos" name="Pagos" fill="#4ade80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
