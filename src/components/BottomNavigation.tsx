import { Home, ArrowUpRight, CreditCard, Heart, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/movimentacoes', icon: ArrowUpRight, label: 'Extrato' },
    { path: '/cartoes', icon: CreditCard, label: 'Cartões' },
    { path: '/casal', icon: Heart, label: 'Casal' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 pb-8 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${
              isActive ? 'text-[#820ad1]' : 'text-zinc-600 hover:text-zinc-300'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
