import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Phone, Mail, MapPin, Eye, FileText, AlertCircle, Clock, Users } from 'lucide-react';
import { mockPatients } from '../data/mockData';
import type { Patient } from '../types';

export const MyPatientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'age'>('lastVisit');

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = mockPatients.filter(patient => {
      const matchesSearch = `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGender = filterGender === 'all' || patient.gender === filterGender;
      
      return matchesSearch && matchesGender;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'age':
          return a.age - b.age;
        case 'lastVisit':
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterGender, sortBy]);

  const getLastVisitStatus = (lastVisit: string) => {
    const daysSince = Math.floor((new Date().getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 7) return { color: '#10b981', text: 'Recent', icon: Clock };
    if (daysSince <= 30) return { color: '#f59e0b', text: 'This month', icon: Calendar };
    return { color: '#ef4444', text: 'Overdue', icon: AlertCircle };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{ 
      padding: '32px', 
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: '700', 
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Users size={32} style={{ color: 'var(--color-primary)' }} />
              My Patients
            </h1>
            <div style={{ 
              height: '4px', 
              width: '60px', 
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              borderRadius: '2px'
            }}></div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'var(--color-surface)',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                Total Patients: {filteredAndSortedPatients.length}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)'
              }} 
            />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '12px',
                border: '2px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Gender Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '2px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'lastVisit' | 'age')}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '2px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="lastVisit">Last Visit</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 180px 160px 140px 200px',
          gap: '16px',
          padding: '20px 24px',
          backgroundColor: 'var(--color-primary-50)',
          borderBottom: '2px solid var(--color-primary-100)',
          fontSize: '14px',
          fontWeight: '700',
          color: 'var(--color-text-primary)'
        }}>
          <div>Patient</div>
          <div>Contact Information</div>
          <div>Age & Gender</div>
          <div>Last Visit</div>
          <div>Status</div>
          <div style={{ textAlign: 'center' }}>Actions</div>
        </div>

        {/* Table Body */}
        <div>
          {filteredAndSortedPatients.map((patient, index) => {
            const visitStatus = getLastVisitStatus(patient.lastVisit);
            const StatusIcon = visitStatus.icon;

            return (
              <div
                key={patient.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '300px 1fr 180px 160px 140px 200px',
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: index < filteredAndSortedPatients.length - 1 ? '1px solid var(--color-border)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Patient Info */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px'
                }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={patient.avatar}
                      alt={`${patient.firstName} ${patient.lastName}`}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-surface)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: '2px'
                    }}>
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--color-text-tertiary)'
                    }}>
                      ID: {patient.id}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ 
                      fontSize: '14px', 
                      color: 'var(--color-text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {patient.email}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px'
                  }}>
                    <Phone size={14} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ 
                      fontSize: '14px', 
                      color: 'var(--color-text-secondary)'
                    }}>
                      {patient.phone}
                    </span>
                  </div>
                </div>

                {/* Age & Gender */}
                <div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px'
                  }}>
                    {patient.age} years
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    padding: '2px 8px',
                    backgroundColor: patient.gender === 'Male' ? '#dbeafe' : patient.gender === 'Female' ? '#fce7f3' : '#f3f4f6',
                    borderRadius: '12px',
                    display: 'inline-block'
                  }}>
                    {patient.gender}
                  </div>
                </div>

                {/* Last Visit */}
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px'
                  }}>
                    {formatDate(patient.lastVisit)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--color-text-tertiary)'
                  }}>
                    {Math.floor((new Date().getTime() - new Date(patient.lastVisit).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: visitStatus.color + '20',
                    color: visitStatus.color,
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: `1px solid ${visitStatus.color}40`
                  }}>
                    <StatusIcon size={12} />
                    {visitStatus.text}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Eye size={14} />
                    View
                  </button>

                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FileText size={14} />
                    Records
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedPatients.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)'
        }}>
          <Users size={64} style={{ color: 'var(--color-text-tertiary)', marginBottom: '16px' }} />
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            marginBottom: '8px'
          }}>
            No patients found
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary)'
          }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};