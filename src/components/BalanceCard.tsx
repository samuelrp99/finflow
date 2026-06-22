import type { BalanceSummary } from '../types/dashboard';

interface BalanceCardProps {
  data: BalanceSummary;
}

export default function BalanceCard({ data }: BalanceCardProps) {
  const { total, coupleState } = data;
  const totalPaid = coupleState.samuelPaid + coupleState.jessicaPaid;
  const samuelPercent = totalPaid > 0 ? (coupleState.samuelPaid / totalPaid) * 100 : 50;

  return (
    <div className="relative p-6 rounded-3xl overflow-hidden shadow-2xl bg-[#111111] border border-white/5">
      {/* Ultraviolet Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#820ad1]/20 via-transparent to-transparent opacity-60"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#820ad1] rounded-full blur-[80px]"></div>

      <div className="relative z-10">
        <p className="text-zinc-400 text-sm mb-1 font-medium">Património Consolidado</p>
        <h2 className="text-4xl font-bold mb-6 tracking-tight text-white">
          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-medium text-zinc-400">Balanço do Mês</span>
          </div>

          <div className="w-full bg-black/60 rounded-full h-1.5 mb-3 flex overflow-hidden">
            <div
              className="bg-[#820ad1] h-full transition-all duration-500"
              style={{ width: `${samuelPercent}%` }}
            ></div>
            <div
              className="bg-zinc-700 h-full transition-all duration-500"
              style={{ width: `${100 - samuelPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-zinc-500">Samuel</span>
              <span className="text-white font-medium">
                R$ {coupleState.samuelPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-zinc-500">Jéssica</span>
              <span className="text-white font-medium">
                R$ {coupleState.jessicaPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
