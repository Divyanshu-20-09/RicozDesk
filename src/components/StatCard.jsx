import React from 'react';

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '6px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
      </div>
      {Icon && (
        <div style={{ padding: '12px', borderRadius: '8px', background: color || '#f1f5f9', color: 'var(--color-text-main)' }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}