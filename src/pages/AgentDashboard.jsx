import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/StatCard';
import TicketTable from '../components/TicketTable';
import Loading from '../components/Loading';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const isResolvedStatus = (status) => status === 'Resolved' || status === 'Closed';
const isActiveStatus = (status) => status === 'Open' || status === 'In Progress' || status === 'Pending';

export default function AgentDashboard({ userProfile }) {
  const [myTickets, setMyTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) fetchAgentData();
  }, [userProfile]);

  const fetchAgentData = async () => {
    setLoading(true);
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, profiles(full_name)')
      .eq('assigned_to', userProfile.id)
      .order('created_at', { ascending: false });

    if (!error && tickets) {
      const activeTickets = tickets.filter((ticket) => isActiveStatus(ticket.status));
      setMyTickets(activeTickets);
      setStats({
        open: tickets.filter((ticket) => ticket.status === 'Open' || ticket.status === 'In Progress').length,
        pending: tickets.filter((ticket) => ticket.status === 'Pending').length,
        resolved: tickets.filter((ticket) => isResolvedStatus(ticket.status)).length,
      });
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="grid-3">
        <StatCard title="My Open Tickets" value={stats.open} icon={AlertCircle} color="#fee2e2" />
        <StatCard title="My Pending Tickets" value={stats.pending} icon={Clock} color="#fef3c7" />
        <StatCard title="My Resolved Tickets" value={stats.resolved} icon={CheckCircle} color="#dcfce7" />
      </div>

      <div>
        <div className="section-heading-row">
          <div>
            <h3 className="section-title">Assigned To Me</h3>
            <p className="section-subtitle">Tickets that still require action from you.</p>
          </div>
        </div>
        <TicketTable tickets={myTickets} loading={false} />
      </div>
    </div>
  );
}
