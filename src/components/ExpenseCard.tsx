import type { Transaction } from '../types/dashboard';

interface ExpenseCardProps {
  expense: Transaction;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const isIncome = expense.type === 'income';
  const dueLabel = expense.dueDate?.toLowerCase().includes('amanhã');

  return (
    <div className="bg-zinc-900 p-4 rounded-2xl flex items-center justify-between border border-zinc-800">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {expense.title.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-zinc-200">{expense.title}</p>
          <div className="flex gap-2 items-center flex-wrap text-xs">
            <p className="text-zinc-500">{expense.category}</p>
            {expense.dueDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <p className={`text-xs ${dueLabel ? 'text-orange-400' : 'text-zinc-500'}`}>
                  {expense.dueDate}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <span className={`font-semibold ${isIncome ? 'text-emerald-400' : 'text-zinc-100'}`}>
        {isIncome ? '+' : '-'} R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}
