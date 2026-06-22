import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Investments from './pages/Investments';
import PiggyBanks from './pages/PiggyBanks';
import Couple from './pages/Couple';
import Profile from './pages/Profile';
import Login from './pages/Login';
import BottomNavigation from './components/BottomNavigation';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movimentacoes"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cartoes"
            element={
              <ProtectedRoute>
                <Cards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investimentos"
            element={
              <ProtectedRoute>
                <Investments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cofrinhos"
            element={
              <ProtectedRoute>
                <PiggyBanks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/casal"
            element={
              <ProtectedRoute>
                <Couple />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>

        {isAuthenticated && <BottomNavigation />}
      </div>
    </BrowserRouter>
  );
}
