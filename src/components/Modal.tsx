import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function Modal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('expense'); // Corrigido para minúsculo
  const [metodo, setMetodo] = useState('pix');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [responsavel, setResponsavel] = useState('casal');

  const handleSalvar = async () => {
    if (!descricao || !valor) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('transactions').insert([{ 
        title: descricao,  
        amount: parseFloat(valor), 
        type: tipo, // Agora usa a coluna 'type' em minúsculas
        payment_method: metodo,
        due_date: data,
        responsavel: responsavel,
        user_id: user.id 
      }]);

      if (error) throw error;
      onSuccess(); // Recarrega os dados sem F5
      onClose();   // Fecha o modal
    } catch (err: any) {
      console.error('Erro:', err);
      alert('Erro ao salvar: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111111] w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-white">Novo Lançamento</h2>
        
        <input className="w-full bg-black p-4 rounded-xl mb-3 border border-white/10 text-white" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <input className="w-full bg-black p-4 rounded-xl mb-3 border border-white/10 text-white" type="number" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
        <input className="w-full bg-black p-4 rounded-xl mb-3 border border-white/10 text-white" type="date" value={data} onChange={e => setData(e.target.value)} />
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select className="bg-black p-4 rounded-xl border border-white/10 text-white" onChange={e => setTipo(e.target.value)}>
            <option value="expense">Saída (Despesa)</option>
            <option value="income">Entrada (Receita)</option>
          </select>
          <select className="bg-black p-4 rounded-xl border border-white/10 text-white" onChange={e => setMetodo(e.target.value)}>
            <option value="pix">Pix</option>
            <option value="credit">Crédito</option>
            <option value="debit">Débito</option>
          </select>
        </div>

        <select className="w-full bg-black p-4 rounded-xl mb-6 border border-white/10 text-white" value={responsavel} onChange={e => setResponsavel(e.target.value)}>
          <option value="casal">Despesa do Casal (Dividida)</option>
          <option value="samuel">Individual: Samuel</option>
          <option value="jessica">Individual: Jéssica</option>
        </select>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 p-4 rounded-xl bg-white/5 text-white">Cancelar</button>
          <button onClick={handleSalvar} className="flex-1 p-4 rounded-xl bg-[#820ad1] text-white font-bold">Salvar</button>
        </div>
      </div>
    </div>
  );
}