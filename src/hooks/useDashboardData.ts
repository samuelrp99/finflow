import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export function useDashboardData() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Envolvemos a função no useCallback para podermos exportá-la com segurança
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Verifica quem está logado
      const { data: { user } } = await supabase.auth.getUser();

      // Se não houver utilizador, limpa os dados e para por aqui
      if (!user) {
        setTransactions([]);
        return;
      }

      // 2. Vai buscar APENAS os dados deste utilizador
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id); // Filtra pelo dono do registo

      if (error) throw error;

      // 3. Formata os dados garantindo que os nomes das colunas coincidem
      const formattedData = (data ?? []).map((tx: any) => ({
        id: tx.id,
        title: tx.title || tx.título || 'Sem título', 
        amount: Number(tx.amount || tx.quantia || 0), 
        type: tx.type || tx.TYPE || tx.TIPO || 'expense',
        // FUNDAMENTAL: Puxar o responsável do banco para as abas funcionarem!
        responsavel: tx.responsavel || 'casal'
      }));

      setTransactions(formattedData);
    } catch (error) {
      console.error("Erro ao carregar os dados do painel:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Exportamos o "refetch" para o Modal o chamar ao fechar
  return { transactions, loading, refetch: fetchTransactions };
}