import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ title, userProfile, onMenuToggle }) {
  const initials = userProfile?.full_name
    ? userProfile.full_name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : 'U';

  return (
    <header className="topbar">
      <button type="button" className="menu-button icon-button" aria-label="Open navigation" onClick={onMenuToggle}>
        <Menu size={20} />
      </button>
      <div>
        <p className="eyebrow">Workspace</p>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <label className="global-search">
          <Search size={16} />
          <input type="text" placeholder="Search operations..." />
        </label>

        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="user-pill">
          <div className="avatar-circle">{initials}</div>
          <div className="user-meta">
            <span>{userProfile?.full_name || 'User'}</span>
            <small>{userProfile?.role || 'Agent'}</small>
          </div>
        </div>
      </div>
    </header>
  );
}