import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { Ticket, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Reports() {
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    const { data: tickets } = await supabase.from('tickets').select('status, priority');

    if (tickets) {
      setStats({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        pending: tickets.filter(t => t.status === 'Pending').length,
        resolved: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
      });
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Operational Analytics</h2>

      <div className="grid-4">
        <StatCard title="Total Tickets" value={stats.total} icon={Ticket} color="#e0f2fe" />
        <StatCard title="Open Operations" value={stats.open} icon={AlertCircle} color="#fee2e2" />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="#fef3c7" />
        <StatCard title="Total Resolved" value={stats.resolved} icon={CheckCircle} color="#dcfce7" />
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Volume Status Breakdown</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Active tickets distributed across open ({stats.open}), pending ({stats.pending}), and completed ({stats.resolved}) stages.
          </p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Category Metrics</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Overview of ticket distribution across support categories.
          </p>
        </div>
      </div>
    </div>
  );
}