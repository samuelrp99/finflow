import { useState } from 'react';
import { supabase } from '../services/supabase';

// 1. Adicionamos a prop 'onSuccess' para avisar o painel que precisa recarregar
export default function Modal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  // 2. Criamos o estado para saber de quem é a conta (padrão: casal)
  const [responsavel, setResponsavel] = useState('casal');

  const handleSalvar = async () => {
    if (!descricao || !valor) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Você precisa fazer login com o Google primeiro!');
        return;
      }

      const { error } = await supabase
        .from('transactions') 
        .insert([
          { 
            title: descricao,  
            amount: parseFloat(valor), 
            TYPE: 'expense',
            user_id: user.id,
            // 3. Enviamos o responsável para o banco de dados
            responsavel: responsavel 
          }
        ]);

      if (error) {
        console.error('ERRO DETALHADO:', error);
        alert('Erro: ' + error.message);
      } else {
        // Removemos o alert de sucesso para ficar mais profissional e fluido
        onSuccess(); // A Mágica do F5: Chama a função que recarrega os dados!
        onClose();   // Fecha o modal
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      alert('Erro ao salvar: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111111] w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-white">Novo Lançamento</h2>

        <input
          type="text"
          placeholder="Descrição (ex: Conta de Luz)"
          className="w-full bg-black p-4 rounded-xl mb-3 border border-white/10 focus:border-[#820ad1] outline-none transition-all text-white placeholder-zinc-600"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor (ex: 250)"
          className="w-full bg-black p-4 rounded-xl mb-3 border border-white/10 focus:border-[#820ad1] outline-none transition-all text-white placeholder-zinc-600"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        {/* 4. O seletor para escolher de quem é a conta */}
        <select
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          className="w-full bg-black p-4 rounded-xl mb-6 border border-white/10 focus:border-[#820ad1] outline-none transition-all text-white"
        >
          <option value="casal">Despesa do Casal (Dividida)</option>
          <option value="samuel">Individual: Samuel</option>
          <option value="jessica">Individual: Jéssica</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 p-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="flex-1 p-4 rounded-xl bg-[#820ad1] text-white hover:bg-[#6a08ab] transition-all font-semibold"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}