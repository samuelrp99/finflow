import { useState, useEffect } from 'react';
import { Wallet, CreditCard, PiggyBank, TrendingUp, Plus, LogOut } from 'lucide-react';
import BalanceCard from '../components/BalanceCard';
import Modal from '../components/Modal';
import { useDashboardData } from '../hooks/useDashboardData';
import { supabase } from '../services/supabase';
import type { BalanceSummary, WidgetData } from '../types/dashboard';

type ProfileView = 'samuel' | 'casal' | 'jessica';

export default function Home() {
  const [activeProfile, setActiveProfile] = useState<ProfileView>('casal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { transactions } = useDashboardData();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error("Erro ao autenticar:", error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const balanceMock: BalanceSummary = {
    total: totalAmount,
    coupleState: { samuelPaid: totalAmount, jessicaPaid: 0.0, jointBalance: 0.0 },
  };

  const widgetsMock: WidgetData[] = [
    { title: 'Contas', amount: totalAmount, iconType: 'wallet', colorClass: 'text-[#820ad1]' },
    { title: 'Cartões', amount: 0.0, iconType: 'creditCard', colorClass: 'text-[#820ad1]' },
    { title: 'Cofrinhos', amount: 0.0, iconType: 'piggyBank', colorClass: 'text-[#820ad1]' },
    { title: 'Investimentos', amount: 0.0, iconType: 'investments', colorClass: 'text-[#820ad1]' },
  ];

  const renderIcon = (type: string, className: string) => {
    switch (type) {
      case 'wallet': return <Wallet className={className} strokeWidth={1.5} />;
      case 'creditCard': return <CreditCard className={className} strokeWidth={1.5} />;
      case 'piggyBank': return <PiggyBank className={className} strokeWidth={1.5} />;
      case 'investments': return <TrendingUp className={className} strokeWidth={1.5} />;
      default: return <Wallet className={className} strokeWidth={1.5} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 font-sans selection:bg-[#820ad1]/30 relative">
      <header className="mb-8 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Olá, {user?.user_metadata?.full_name?.split(' ')[0] || 'Visitante'} 👋
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Visão atual do painel</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          {!user ? (
            <button 
              onClick={handleLoginGoogle}
              className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-all border border-white/5"
            >
              Entrar com Google
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
            >
              <LogOut size={16} /> Sair
            </button>
          )}

          <div className="bg-[#111111] p-1 rounded-full border border-white/5 flex gap-1">
            <button
              onClick={() => setActiveProfile('samuel')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeProfile === 'samuel' ? 'bg-[#820ad1] text-white' : 'text-zinc-500'
              }`}
            >
              Samuel
            </button>
            <button
              onClick={() => setActiveProfile('casal')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeProfile === 'casal' ? 'bg-white/10 text-white' : 'text-zinc-500'
              }`}
            >
              Casal
            </button>
            <button
              onClick={() => setActiveProfile('jessica')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeProfile === 'jessica' ? 'bg-pink-600 text-white' : 'text-zinc-500'
              }`}
            >
              Jéssica
            </button>
          </div>
        </div>
      </header>

      <BalanceCard data={balanceMock} />

      <section className="grid grid-cols-2 gap-4 my-6">
        {widgetsMock.map((widget, index) => (
          <div key={index} className="bg-[#111111] p-5 rounded-3xl border border-white/5 transition-all active:scale-95 flex flex-col justify-between h-32 relative overflow-hidden">
            {renderIcon(widget.iconType, `w-6 h-6 ${widget.colorClass}`)}
            <div className="relative z-10 mt-4">
              <p className="text-zinc-400 text-xs font-medium mb-1">{widget.title}</p>
              <h3 className="text-xl font-semibold text-white">
                R$ {widget.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 space-y-6">
        <div>
          <h3 className="text-xs font-semibold mb-4 text-zinc-500 uppercase tracking-wider">Próximos Vencimentos</h3>
          <div className="bg-[#111111] p-6 rounded-3xl border border-white/5 text-center">
            <p className="text-zinc-500 text-sm">Nenhuma conta pendente.</p>
          </div>
        </div>
      </section>

      {user && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#820ad1] hover:bg-[#6c08ad] rounded-full shadow-[0_0_30px_rgba(130,10,209,0.4)] flex items-center justify-center transition-transform active:scale-90 z-40"
        >
          <Plus size={28} className="text-white" />
        </button>
      )}

      {/* AQUI ESTÁ A MÁGICA: Modal com onSuccess */}
      {isModalOpen && (
        <Modal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload(); // Recarrega os dados instantaneamente
          }} 
        />
      )}
    </div>
  );
}