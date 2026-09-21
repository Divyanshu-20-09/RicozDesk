import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { ArrowLeft, MessageSquare, Send, User } from 'lucide-react';

export default function TicketDetails({ userProfile }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [assigningAgent, setAssigningAgent] = useState(false);
  const [assignmentError, setAssignmentError] = useState('');

  useEffect(() => {
    fetchTicketData();
    fetchAgents();
  }, [id]);

  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('role', 'agent');

    if (error) {
      console.error('Failed to load agents:', error.message);
      return;
    }

    if (data) setAgents(data);
  };

  const fetchTicketData = async () => {
    setLoading(true);

    const { data: ticketData } = await supabase
      .from('tickets')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single();

    if (ticketData) setTicket(ticketData);

    const { data: commentsData } = await supabase
      .from('ticket_comments')
      .select('*, profiles(full_name)')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true });

    if (commentsData) setComments(commentsData);

    setLoading(false);
  };

  const updateField = async (field, value) => {
    const { error } = await supabase
      .from('tickets')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setTicket((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setCommentError('Please enter a comment before submitting.');
      return;
    }

    if (!userProfile?.id) {
      setCommentError('Your profile is not available. Please refresh and try again.');
      return;
    }

    setSubmittingComment(true);
    setCommentError('');

    const { data, error } = await supabase
      .from('ticket_comments')
      .insert([
        {
          ticket_id: Number(id),
          user_id: userProfile.id,
          comment: newComment.trim(),
        },
      ])
      .select('*, profiles(full_name)');

    if (error) {
      setCommentError(error.message || 'Unable to add comment right now.');
      setSubmittingComment(false);
      return;
    }

    if (data && data[0]) {
      setComments((prev) => [...prev, data[0]]);
      setNewComment('');
    }

    setSubmittingComment(false);
  };

  const handleAssignAgent = async (event) => {
    const nextAgentId = event.target.value || null;
    setAssigningAgent(true);
    setAssignmentError('');

    const { error } = await supabase
      .from('tickets')
      .update({ assigned_to: nextAgentId, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      setAssignmentError(error.message || 'Unable to assign agent.');
      setAssigningAgent(false);
      return;
    }

    setTicket((prev) => ({
      ...prev,
      assigned_to: nextAgentId,
      updated_at: new Date().toISOString(),
    }));

    setAssigningAgent(false);
  };

  if (loading) return <Loading />;
  if (!ticket) return <div>Ticket not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/tickets')}>
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div className="ticket-details-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Ticket #{ticket.id}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>{ticket.title}</h2>
            <div style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#334155' }}>
              {ticket.description}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} /> Activity & Comments
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {comments.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No activity logged yet.</div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{c.profiles?.full_name || 'Agent'}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#334155' }}>{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Write an internal note or reply..."
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    if (commentError) setCommentError('');
                  }}
                />
              </div>

              {commentError && (
                <div style={{ marginBottom: '12px', color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>
                  {commentError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={submittingComment || !newComment.trim()}>
                <Send size={14} /> {submittingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Properties
            </h3>

            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={ticket.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" value={ticket.priority} onChange={(e) => updateField('priority', e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assigned Agent</label>
              <select
                className="form-control"
                value={ticket.assigned_to || ''}
                onChange={handleAssignAgent}
                disabled={assigningAgent}
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name}
                  </option>
                ))}
              </select>
              {assignmentError && (
                <div style={{ marginTop: '8px', color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 10px', fontSize: '12px' }}>
                  {assignmentError}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Customer Details
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <User size={16} color="var(--color-text-muted)" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{ticket.customer_name}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{ticket.customer_email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}