import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import TicketTable from '../components/TicketTable';
import Loading from '../components/Loading';
import { Plus, Search } from 'lucide-react';

const isActiveStatus = (status) => status === 'Open' || status === 'In Progress' || status === 'Pending';

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let result = tickets;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q) ||
        t.customer_email.toLowerCase().includes(q)
      );
    }
    if (statusFilter === 'active') {
      result = result.filter((t) => isActiveStatus(t.status));
    } else if (statusFilter) {
      result = result.filter(t => t.status === statusFilter);
    }
    if (priorityFilter) {
      result = result.filter(t => t.priority === priorityFilter);
    }

    setFilteredTickets(result);
  }, [search, statusFilter, priorityFilter, tickets]);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 className="page-title">Ticket Queue</h2>
          <p className="page-subtitle">Focus on tickets that still need attention. Closed tickets remain available through the status filter.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tickets/create')}>
          <Plus size={16} /> Create Ticket
        </button>
      </div>

      <div className="card ticket-filters">
        <div className="search-field">
          <Search size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="active">Active Tickets</option>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select className="form-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {loading ? <Loading /> : <TicketTable tickets={filteredTickets} loading={false} />}
    </div>
  );
}
