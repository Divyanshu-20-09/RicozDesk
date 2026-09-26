import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { Ticket, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const isResolvedStatus = (status) => status === 'Resolved' || status === 'Closed';
const isActiveStatus = (status) => status === 'Open' || status === 'In Progress' || status === 'Pending';

export default function Reports() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('tickets')
      .select('status, priority, category');

    if (fetchError) {
      setError(fetchError.message || 'Unable to load analytics right now.');
      setTickets([]);
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  };

  const stats = useMemo(() => ({
    total: tickets.length,
    active: tickets.filter((ticket) => isActiveStatus(ticket.status)).length,
    pending: tickets.filter((ticket) => ticket.status === 'Pending').length,
    resolved: tickets.filter((ticket) => isResolvedStatus(ticket.status)).length,
  }), [tickets]);

  const statusBreakdown = useMemo(() => {
    const statuses = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
    return statuses.map((status) => ({
      label: status,
      count: tickets.filter((ticket) => ticket.status === status).length,
    }));
  }, [tickets]);

  const categoryBreakdown = useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
      const category = ticket.category || 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  const maxStatusCount = Math.max(...statusBreakdown.map((item) => item.count), 1);
  const maxCategoryCount = Math.max(...categoryBreakdown.map(([, count]) => count), 1);

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 className="page-title">Operational Analytics</h2>
        <p className="page-subtitle">A quick view of ticket volume, status distribution, and support categories.</p>
      </div>

      {error && <div className="card inline-error">{error}</div>}

      <div className="grid-4">
        <StatCard title="Total Tickets" value={stats.total} icon={Ticket} color="#e0f2fe" />
        <StatCard title="Active Tickets" value={stats.active} icon={AlertCircle} color="#fee2e2" />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="#fef3c7" />
        <StatCard title="Resolved Tickets" value={stats.resolved} icon={CheckCircle} color="#dcfce7" />
      </div>

      <div className="grid-2">
        <div className="card analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Volume Status Breakdown</h3>
              <p>How tickets are currently distributed across their lifecycle.</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="metric-list">
            {statusBreakdown.map((item) => (
              <div className="metric-row" key={item.label}>
                <div className="metric-label-row">
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="metric-track">
                  <div className="metric-fill" style={{ width: `${(item.count / maxStatusCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Category Metrics</h3>
              <p>Ticket volume grouped by support category.</p>
            </div>
            <Ticket size={20} />
          </div>
          {categoryBreakdown.length === 0 ? (
            <div className="empty-state">No category data available yet.</div>
          ) : (
            <div className="metric-list">
              {categoryBreakdown.map(([category, count]) => (
                <div className="metric-row" key={category}>
                  <div className="metric-label-row">
                    <span>{category}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="metric-track">
                    <div className="metric-fill" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
