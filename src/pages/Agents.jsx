import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Loading from '../components/Loading';
import { Plus, ShieldAlert } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data) {
      setAgents(data);
    }
    setLoading(false);
  };

  const handleAddAgentNotice = () => {
    alert("Creating users client-side requires backend admin rights. Create agent users directly via your Supabase Console.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Agent Roster</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Manage platform support agents and operational permissions.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddAgentNotice}>
          <Plus size={16} /> Add Agent
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td style={{ fontWeight: 600 }}>{agent.full_name}</td>
                  <td>{agent.email}</td>
                  <td>
                    <span className="badge" style={{ background: agent.role === 'admin' ? '#fef2f2' : '#e0f2fe', color: agent.role === 'admin' ? '#991b1b' : '#0369a1' }}>
                      {agent.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {new Date(agent.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card" style={{ display: 'flex', gap: '12px', background: '#fffbeb', borderColor: '#fef3c7' }}>
        <ShieldAlert color="#b45309" size={20} />
        <div style={{ fontSize: '13px', color: '#92400e' }}>
          <strong>Admin Note:</strong> New agent registration enforces RLS security. Invite staff through the Supabase Authentication dashboard.
        </div>
      </div>
    </div>
  );
}