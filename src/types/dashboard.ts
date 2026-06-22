export interface BalanceSummary {
  total: number;
  coupleState: {
    samuelPaid: number;
    jessicaPaid: number;
    jointBalance: number;
  };
}

export interface WidgetData {
  title: string;
  amount: number;
  iconType: 'wallet' | 'creditCard' | 'piggyBank' | 'investments';
  colorClass: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  dueDate?: string;
  isPaid: boolean;
}
