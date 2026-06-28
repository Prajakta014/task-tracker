import React from 'react';
import { FiCheckCircle, FiClock, FiLoader, FiList } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flex: 1,
    minWidth: '140px'
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: `${color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

export default function StatsBar({ stats }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      <StatCard icon={FiList} label="Total Tasks" value={stats.total} color="#7c3aed" />
      <StatCard icon={FiClock} label="Pending" value={stats.byStatus.pending} color="var(--status-pending)" />
      <StatCard icon={FiLoader} label="In Progress" value={stats.byStatus['in-progress']} color="var(--status-inprogress)" />
      <StatCard icon={FiCheckCircle} label="Completed" value={stats.byStatus.completed} color="var(--status-completed)" />
    </div>
  );
}
