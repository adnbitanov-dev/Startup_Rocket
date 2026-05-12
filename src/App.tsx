import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './store/UserContext';
import { DataProvider } from './store/DataContext';
import MobileLayout from './layouts/MobileLayout';
import WelcomeScreen from './pages/auth/WelcomeScreen';
import PhoneAuth from './pages/auth/PhoneAuth';
import RoleSelect from './pages/auth/RoleSelect';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerOrders from './pages/customer/CustomerOrders';
import CreateOrder from './pages/customer/CreateOrder';
import DisputeChat from './pages/customer/DisputeChat';
import Chat from './pages/Chat';
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import ContractorFeed from './pages/contractor/ContractorFeed';
import ContractorJobs from './pages/contractor/ContractorJobs';
import AdminDashboard from './pages/admin/AdminDashboard';
import EscrowOnboarding from './components/ui/EscrowOnboarding';
import Profile from './pages/Profile';

function AuthFlow() {
  const { setAuthenticated, setOnboarded, setRole } = useUser();
  const [authStep, setAuthStep] = useState<'welcome' | 'phone' | 'role' | 'escrow'>('welcome');

  if (authStep === 'welcome') {
    return <WelcomeScreen onComplete={() => setAuthStep('phone')} />;
  }

  if (authStep === 'phone') {
    return (
      <PhoneAuth
        onBack={() => setAuthStep('welcome')}
        onSuccess={(phone) => {
          if (phone === '77019563020') {
            setRole('customer');
            setAuthStep('escrow');
          } else if (phone === '7771234567') {
            setRole('contractor');
            setAuthStep('escrow');
          } else if (phone === '77007007007') {
            setRole('admin');
            setAuthenticated(true);
            setOnboarded(true);
          } else {
            setAuthStep('role');
          }
        }}
      />
    );
  }

  if (authStep === 'role') {
    return (
      <RoleSelect
        onSelect={(role) => {
          setRole(role);
          setAuthStep('escrow');
        }}
      />
    );
  }

  return (
    <EscrowOnboarding
      onComplete={() => {
        setAuthenticated(true);
        setOnboarded(true);
      }}
    />
  );
}

function RoleRedirect() {
  const { role } = useUser();
  return <Navigate to={role === 'customer' ? '/customer' : role === 'admin' ? '/admin' : '/contractor'} replace />;
}

function AppContent() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <Routes>
      <Route path="/" element={<MobileLayout />}>
        <Route index element={<RoleRedirect />} />
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="customer/orders" element={<CustomerOrders />} />
        <Route path="contractor" element={<ContractorDashboard />} />
        <Route path="contractor/feed" element={<ContractorFeed />} />
        <Route path="contractor/jobs" element={<ContractorJobs />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<RoleRedirect />} />
      </Route>
      {/* Standalone full-screen routes */}
      <Route path="customer/create-order" element={<CreateOrder />} />
      <Route path="dispute/:orderId" element={<DisputeChat />} />
      <Route path="chat/:orderId" element={<Chat />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
