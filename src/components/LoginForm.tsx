import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Heart, Shield } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
         }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating medical icons */}
        <div className="absolute top-20 left-20 opacity-10 animate-pulse">
          <Heart className="w-16 h-16" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div className="absolute top-40 right-32 opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>
          <Activity className="w-12 h-12" style={{ color: 'var(--color-success)' }} />
        </div>
        <div className="absolute bottom-32 left-32 opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>
          <Shield className="w-14 h-14" style={{ color: 'var(--color-warning)' }} />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Activity className="w-10 h-10" style={{ color: 'var(--color-error)' }} />
        </div>
      </div>
      
      <div className="w-full max-w-md mx-4 fade-in relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8" 
             style={{ 
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
               backdropFilter: 'blur(10px)'
             }}>
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center" 
                 style={{ 
                   background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                   boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
                 }}>
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-3">
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: '800', 
                color: 'var(--color-text-primary)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Healthcare
              </h1>
              <p style={{ 
                fontSize: '1.125rem', 
                color: 'var(--color-text-secondary)',
                fontWeight: '500' 
              }}>
                Professional Medical Dashboard
              </p>
              <p className="text-small" style={{ color: 'var(--color-text-tertiary)' }}>
                Secure access to patient care systems
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
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
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '2px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border-light)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)' 
                }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '16px 20px',
                      paddingRight: '60px',
                      borderRadius: '16px',
                      border: '2px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-small text-center status-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px 24px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                opacity: isLoading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
          
          <div className="pt-6 border-t space-y-4" 
               style={{ 
                 borderColor: 'var(--color-border-light)',
                 borderImage: 'linear-gradient(90deg, transparent, var(--color-border-light), transparent) 1'
               }}>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              textAlign: 'center', 
              color: 'var(--color-text-secondary)' 
            }}>
              Demo Access Credentials
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-2xl" 
                   style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)' }}>DOCTOR</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>doctor / password</div>
              </div>
              <div className="text-center p-3 rounded-2xl" 
                   style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-success)' }}>NURSE</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>nurse / password</div>
              </div>
              <div className="text-center p-3 rounded-2xl" 
                   style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-warning)' }}>ADMIN</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>admin / password</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};