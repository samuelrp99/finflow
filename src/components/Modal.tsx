import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function Modal({ onClose }: { onClose: () => void }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = async () => {
    if (!descricao || !valor) return;

    try {
      // 1. Descobre quem está logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Você precisa fazer login com o Google primeiro!');
        return;
      }

      // 2. Salva no banco com o ID do usuário
      const { error } = await supabase
        .from('transactions') 
        .insert([
          { 
            title: descricao,  
            amount: parseFloat(valor), 
            TYPE: 'expense',
            user_id: user.id  // Vincula o gasto ao ID do seu Google
          }
        ]);

      if (error) {
        console.error('ERRO DETALHADO:', error);
        alert('Erro: ' + error.message);
      } else {
        alert('Sucesso! Lançamento gravado no seu perfil.');
        onClose();
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
          placeholder="Descrição (ex: Luz)"
          className="w-full bg-black p-4 rounded-xl mb-3 border border-white/10 focus:border-[#820ad1] outline-none transition-all text-white placeholder-zinc-600"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor (ex: 250)"
          className="w-full bg-black p-4 rounded-xl mb-6 border border-white/10 focus:border-[#820ad1] outline-none transition-all text-white placeholder-zinc-600"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

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