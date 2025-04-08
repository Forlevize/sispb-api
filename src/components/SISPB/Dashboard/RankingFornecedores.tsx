
import { LineChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

interface DadosFornecedor {
  fornecedor: string;
  valor: number;
}

interface RankingFornecedoresProps {
  dados: DadosFornecedor[];
}

export default function RankingFornecedores({ dados }: RankingFornecedoresProps) {
  // Sort data by value in descending order
  const dadosOrdenados = [...dados].sort((a, b) => b.valor - a.valor);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01] duration-300">
      <div className="flex items-center mb-4">
        <LineChart className="h-6 w-6 text-[#00c6a7] mr-2" />
        <h2 className="text-lg font-bold text-gray-800">Ranking de Fornecedores</h2>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={dadosOrdenados}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#333', fontSize: 12 }} />
            <YAxis 
              dataKey="fornecedor" 
              type="category" 
              width={150} 
              tick={{ fill: '#333', fontSize: 12 }} 
            />
            <Tooltip 
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Total"]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="valor" name="Total em R$" fill="#60a5fa" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
