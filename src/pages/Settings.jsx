import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Settings({ userProfile }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="page-title">Account Settings</h2>
        <p className="page-subtitle">View your account information and manage your session.</p>
      </div>

      <div className="card settings-card">
        <div className="form-group">
          <label>Full Name <span className="field-hint">Read-only</span></label>
          <input type="text" className="form-control" value={userProfile?.full_name || ''} disabled />
        </div>

        <div className="form-group">
          <label>Email Address <span className="field-hint">Read-only</span></label>
          <input type="email" className="form-control" value={userProfile?.email || ''} disabled />
        </div>

        <div className="form-group">
          <label>Role <span className="field-hint">Read-only</span></label>
          <input type="text" className="form-control" value={userProfile?.role || ''} disabled />
        </div>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <button className="btn btn-outline sign-out-btn" style={{ color: '#be123c', borderColor: '#fecaca' }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}