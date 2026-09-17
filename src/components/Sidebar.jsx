import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { LayoutDashboard, Ticket, Users, BarChart2, Settings, LogOut, ShieldCheck } from 'lucide-react';

export default function Sidebar({ userProfile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand-block">
          <div className="brand-mark">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="brand-name">RicozDesk</div>
            <div className="brand-subtitle">Ops Console</div>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/tickets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Ticket size={17} />
            <span>Tickets</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/agents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={17} />
              <span>Agents</span>
            </NavLink>
          )}
          <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={17} />
            <span>Reports</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={17} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="profile-box">
          <div className="profile-name">{userProfile?.full_name || 'Agent User'}</div>
          <div className="profile-role">{userProfile?.role || 'Agent'}</div>
        </div>
        <button type="button" onClick={handleLogout} className="btn btn-outline sidebar-logout">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}