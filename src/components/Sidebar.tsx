import React from 'react';
import { 
  Activity, 
  Calendar,
  UserCheck,
  Clock,
  CreditCard,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react';

interface SidebarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, onNavigate }) => {
  const menuItems = [
    { icon: Activity, label: 'Overview', page: 'overview' },
    { icon: Calendar, label: 'Appointment', page: 'appointments' },
    { icon: UserCheck, label: 'My Patient', page: 'patients' },
    { icon: Clock, label: 'Schedule Timings', page: 'schedule' },
    { icon: CreditCard, label: 'Payments', page: 'payments' },
    { icon: MessageSquare, label: 'Message', page: 'messages' },
    { icon: FileText, label: 'Blog', page: 'blog' },
    { icon: Settings, label: 'Settings', page: 'settings' },
  ];

  return (
    <div 
      style={{ 
        width: '256px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRight: '1px solid var(--color-border-light)',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)'
      }}>
      {/* Logo/Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
               style={{ background: 'var(--color-primary)' }}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-subheading font-semibold" 
                style={{ color: 'var(--color-text-primary)' }}>
            Ascensio
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: '16px' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={index}
                onClick={() => onNavigate(item.page)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive 
                    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                    : 'transparent',
                  color: isActive ? 'white' : '#6b7280',
                  fontWeight: isActive ? '500' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <Icon style={{ width: '20px', height: '20px', color: isActive ? 'white' : '#9ca3af' }} />
                <span style={{ fontSize: '14px', color: isActive ? 'white' : 'inherit' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '16px', 
        borderTop: '1px solid var(--color-border-light)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" 
               style={{ background: 'var(--color-primary)', opacity: 0.1 }}>
            <span className="text-small font-medium" 
                  style={{ color: 'var(--color-primary)' }}>
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div>
            <div className="text-small font-medium" 
                 style={{ color: 'var(--color-text-primary)' }}>
              {user.firstName} {user.lastName}
            </div>
            <div className="text-caption" 
                 style={{ color: 'var(--color-text-secondary)' }}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};