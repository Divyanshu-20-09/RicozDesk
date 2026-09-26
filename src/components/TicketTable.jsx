import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TicketTable({ tickets, loading }) {
  const navigate = useNavigate();

  if (loading) return <div>Loading tickets...</div>;

  if (!tickets || tickets.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
        No tickets found
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Agent</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}>
                <td style={{ fontWeight: 600, color: '#475569' }}>#{t.id}</td>
                <td style={{ fontWeight: 600 }}>{t.title}</td>
                <td>
                  <div>{t.customer_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t.customer_email}</div>
                </td>
                <td>{t.category || 'General'}</td>
                <td><PriorityBadge priority={t.priority} /></td>
                <td><StatusBadge status={t.status} /></td>
                <td>{t.profiles?.full_name || 'Unassigned'}</td>
                <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}