import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/StatCard';
import TicketTable from '../components/TicketTable';
import Loading from '../components/Loading';
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, resolved: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) {
        throw ticketsError;
      }

      const uniqueAgentIds = [...new Set((tickets || []).filter((ticket) => ticket.assigned_to).map((ticket) => ticket.assigned_to))];
      let agentMap = {};

      if (uniqueAgentIds.length > 0) {
        const { data: agents, error: agentsError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', uniqueAgentIds);

        if (agentsError) {
          throw agentsError;
        }

        agentMap = Object.fromEntries((agents || []).map((agent) => [agent.id, agent.full_name]));
      }

      const enrichedTickets = (tickets || []).map((ticket) => ({
        ...ticket,
        profiles: {
          full_name: ticket.assigned_to ? agentMap[ticket.assigned_to] || 'Unassigned' : 'Unassigned',
        },
      }));

      setRecentTickets(enrichedTickets.slice(0, 5));
      setStats({
        total: enrichedTickets.length,
        open: enrichedTickets.filter((ticket) => ticket.status === 'Open').length,
        pending: enrichedTickets.filter((ticket) => ticket.status === 'Pending').length,
        resolved: enrichedTickets.filter((ticket) => ticket.status === 'Resolved').length,
      });
    } catch (fetchError) {
      console.error('Admin dashboard fetch failed:', fetchError);
      setError(fetchError?.message || 'Unable to load tickets right now.');
      setRecentTickets([]);
      setStats({ total: 0, open: 0, pending: 0, resolved: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && (
        <div className="card" style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div className="grid-4">
        <StatCard title="Total Tickets" value={stats.total} icon={Ticket} color="#e0f2fe" />
        <StatCard title="Open Tickets" value={stats.open} icon={AlertCircle} color="#fee2e2" />
        <StatCard title="Pending Operations" value={stats.pending} icon={Clock} color="#fef3c7" />
        <StatCard title="Resolved Tickets" value={stats.resolved} icon={CheckCircle} color="#dcfce7" />
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Operational Overview</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            System activity metrics for response tracking and queue monitoring across support agents.
          </p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>SLA Health Risk</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            All standard tickets operating within resolution standard limits.
          </p>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Recent Tickets</h3>
        <TicketTable tickets={recentTickets} loading={false} />
      </div>
    </div>
  );
}