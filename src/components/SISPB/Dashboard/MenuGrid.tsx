
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuItem {
  nome: string;
  icone: ReactNode;
  acao: () => void;
  descricao?: string;
}

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {items.map((item, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={item.acao}
                className="group flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:bg-[#00c6a7] transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-[#00c6a7]/20"
              >
                <div className="text-[#00c6a7] text-3xl mb-4 group-hover:text-white transition-colors duration-300">
                  {item.icone}
                </div>
                <span className="text-base font-semibold text-center text-gray-800 group-hover:text-white transition-colors duration-300">
                  {item.nome}
                </span>
                {item.descricao && (
                  <span className="text-xs mt-2 text-gray-500 group-hover:text-white/90 transition-colors duration-300 hidden sm:block">
                    {item.descricao}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            {item.descricao && (
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{item.descricao}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
