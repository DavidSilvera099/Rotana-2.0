import './index.css'
import Logo from './assets/Logo-azul.webp'
import LoginTemplate from './components/templates/LoginTemplate'
import DashboardPage from './components/pages/DashboardPage'
import Spinner from './components/atoms/Spinner'
import { AuthProvider } from './contexts/AuthContext'
import { useAuthContext } from './contexts/useAuthContext'

function AppContent() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return user ? <DashboardPage /> : <LoginTemplate logoSrc={Logo} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
