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
  const { loginUser, setOnboarded } = useUser();
  const [authStep, setAuthStep] = useState<'welcome' | 'phone' | 'role' | 'escrow'>('welcome');
  const [tempPhone, setTempPhone] = useState('');

  if (authStep === 'welcome') {
    return <WelcomeScreen onComplete={() => setAuthStep('phone')} />;
  }

  if (authStep === 'phone') {
    return (
      <PhoneAuth
        onBack={() => setAuthStep('welcome')}
        onSuccess={(phone) => {
          setTempPhone(phone);
          if (phone === '77019563020') {
            loginUser('u-customer', 'Алексей (Заказчик)', '+7 (701) 956-30-20', 'customer');
            setAuthStep('escrow');
          } else if (phone === '7771234567') {
            loginUser('u-contractor', 'Арман (Исполнитель)', '+7 (777) 123-45-67', 'contractor');
            setAuthStep('escrow');
          } else if (phone === '77007007007') {
            loginUser('u-admin', 'Аскар (Технадзор)', '+7 (700) 700-70-07', 'admin');
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
        onSelect={(role, name) => {
          const digits = tempPhone.replace(/\D/g, '') || Date.now().toString().slice(-10);
          const generatedId = `usr-${digits}`;
          
          let formattedPhone = tempPhone;
          if (digits.length === 11) {
            formattedPhone = `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
          } else {
            formattedPhone = `+7 ${digits}`;
          }
          
          loginUser(generatedId, name, formattedPhone, role);
          setAuthStep('escrow');
        }}
      />
    );
  }

  return (
    <EscrowOnboarding
      onComplete={() => {
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
