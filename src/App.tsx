import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import './App.css';

function App() {
  const { user, login, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('overview');

  if (!user) {
    return <LoginForm onLogin={login} isLoading={isLoading} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar 
        user={user} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
      />
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Welcome to Ascensio
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
            Current page: <strong>{currentPage}</strong>
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            This is your new Ascensio application built with React + TypeScript and Vite.
            The sidebar navigation is functional and ready for your custom content.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App
