import React, { useState } from 'react';
import { Activity, Heart, Shield } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await onLogin(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 500px',
      overflow: 'hidden'
    }}>
      {/* Left side - Medical image */}
      <div style={{
        height: '100vh',
        backgroundColor: '#ff0000',
        position: 'relative'
      }}>
        <img 
          src="/pharmacist picture.jpg"
          alt="Healthcare professionals"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block'
          }}
          onError={(e) => {
            console.log('Image failed to load');
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
          }}
        />
        {/* Overlay for better contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          pointerEvents: 'none'
        }}></div>
      </div>
      
      {/* Right side - Login form */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)'
      }}>
      <div style={{
        width: '400px',
        opacity: 1,
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <div style={{ 
          padding: '48px',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '32px'
        }}>
          <div style={{ textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/ascensio-logo.jpg" 
                alt="Ascensio Logo" 
                style={{
                  width: '120px',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                color: 'var(--color-text-primary)',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                margin: '0'
              }}>
                ASCENSIO
              </h1>
              <p style={{ 
                fontSize: '1.125rem', 
                color: 'var(--color-text-secondary)',
                fontWeight: '600',
                letterSpacing: '0.025em',
                margin: '0'
              }}>
                Advanced Healthcare Analytics
              </p>
              <p style={{ 
                color: 'var(--color-text-tertiary)',
                fontSize: '14px',
                maxWidth: '280px',
                margin: '0 auto',
                lineHeight: '1.5'
              }}>
                Secure access to comprehensive medical data analysis and patient care insights
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                <label htmlFor="username" style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)' 
                }}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ 
                    width: '300px',
                    maxWidth: '100%',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#1e293b',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    margin: '0 auto',
                    display: 'block'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'translateY(0px)';
                  }}
                  placeholder="Enter your username"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                <label htmlFor="password" style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)' 
                }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: '300px',
                    maxWidth: '100%',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#1e293b',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    margin: '0 auto',
                    display: 'block'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'translateY(0px)';
                  }}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                textAlign: 'center' as const,
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '300px',
                maxWidth: '100%',
                padding: '20px 32px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                opacity: isLoading ? 0.8 : 1,
                position: 'relative' as const,
                overflow: 'hidden',
                margin: '0 auto',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)';
                }
              }}
            >
              {isLoading ? (
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
          
          {/* Demo credentials section */}
          <div style={{ 
            paddingTop: '32px',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center' as const }}>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                textAlign: 'center' as const, 
                color: '#475569',
                marginBottom: '4px',
                margin: '0 0 4px 0'
              }}>
                Demo Access Credentials
              </p>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                textAlign: 'center' as const,
                margin: '0'
              }}>
                Use the demo account below for testing
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '320px',
                backgroundColor: 'rgba(59, 130, 246, 0.05)', 
                border: '1px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6'
                  }}></div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>DEMO ACCESS</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Full access to medical data</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', fontFamily: 'monospace' }}>
                  doctor / password
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};