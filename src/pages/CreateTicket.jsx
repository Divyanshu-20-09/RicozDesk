import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    customer_name: '',
    customer_email: '',
    category: 'General Support',
    priority: 'Medium',
    assigned_to: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name');
    if (data) setAgents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...form,
      status: 'Open',
      assigned_to: form.assigned_to || null
    };

    const { error: insertErr } = await supabase.from('tickets').insert([payload]);

    if (insertErr) {
      setError(insertErr.message);
      setLoading(false);
    } else {
      navigate('/tickets');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '16px' }} onClick={() => navigate('/tickets')}>
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Create New Ticket</h2>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ticket Title</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Cannot access dashboard"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="John Doe"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Customer Email</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="john@example.com"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="General Support">General Support</option>
                <option value="Billing">Billing</option>
                <option value="Technical Bug">Technical Bug</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assign Agent</label>
              <select className="form-control" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}>
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={5}
              required
              placeholder="Describe the issue reported by customer..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}