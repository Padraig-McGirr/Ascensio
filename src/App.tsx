import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './components/OverviewPage';
import { ResultsTable } from './components/ResultsTable';
import { WhiteBloodCellsPage } from './components/WhiteBloodCellsPage';
import { RedBloodCellsPage } from './components/RedBloodCellsPage';
import { LiverFunctionPage } from './components/LiverFunctionPage';
import { LipidProfilePage } from './components/LipidProfilePage';
import { KidneyFunctionPage } from './components/KidneyFunctionPage';
import { BloodSugarTshPsaPage } from './components/BloodSugarTshPsaPage';
import { MyPatientsPage } from './components/MyPatientsPage';
import { ComparographPage } from './components/ComparographPage';
import './App.css';

function App() {
  const { user, login, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('overview');

  if (!user) {
    return <LoginForm onLogin={login} isLoading={isLoading} />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-background)', 
      width: '100vw',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <Sidebar 
        user={user} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
      />
      <main style={{ 
        flex: 1, 
        width: 'calc(100vw - 256px)',
        maxWidth: 'calc(100vw - 256px)', 
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        {currentPage === 'overview' ? (
          <OverviewPage onNavigate={setCurrentPage} />
        ) : currentPage === 'appointments' ? (
          <ResultsTable />
        ) : currentPage === 'white-blood-cells' ? (
          <WhiteBloodCellsPage />
        ) : currentPage === 'red-blood-cells' ? (
          <RedBloodCellsPage />
        ) : currentPage === 'liver-function' ? (
          <LiverFunctionPage />
        ) : currentPage === 'lipid-profile' ? (
          <LipidProfilePage />
        ) : currentPage === 'kidney-function' ? (
          <KidneyFunctionPage />
        ) : currentPage === 'blood-sugar-tsh-psa' ? (
          <BloodSugarTshPsaPage />
        ) : currentPage === 'patients' ? (
          <MyPatientsPage />
        ) : currentPage === 'comparograph' ? (
          <ComparographPage onNavigate={setCurrentPage} />
        ) : (
          <div style={{ padding: '32px' }}>
            <div className="medical-card" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderRadius: '12px', 
              padding: '40px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ 
                  fontSize: 'var(--text-3xl)', 
                  fontWeight: '700', 
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}>
                  {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
                </h1>
                <div style={{ 
                  height: '4px', 
                  width: '60px', 
                  background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  borderRadius: '2px',
                  marginBottom: '16px'
                }}></div>
              </div>
              
              <div style={{ 
                backgroundColor: 'var(--color-primary-50)', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid var(--color-primary-100)',
                marginBottom: '32px'
              }}>
                <p style={{ 
                  fontSize: 'var(--text-base)', 
                  color: 'var(--color-text-primary)', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Current page: <span style={{ 
                    color: 'var(--color-primary)', 
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>{currentPage}</span>
                </p>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px'
                }}>
                  Page Under Development
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-base)', 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: '1.6',
                  marginBottom: '0'
                }}>
                  This page is ready for your blood test analytics content. The overview page 
                  shows the complete dashboard layout structure.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App
