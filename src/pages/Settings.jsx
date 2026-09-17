import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Settings({ userProfile }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700 }}>User Profile & Preferences</h2>

      <div className="card">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" className="form-control" value={userProfile?.full_name || ''} disabled />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" className="form-control" value={userProfile?.email || ''} disabled />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input type="text" className="form-control" value={userProfile?.role || ''} disabled />
        </div>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <button className="btn btn-outline" style={{ color: '#be123c', borderColor: '#fecaca' }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}