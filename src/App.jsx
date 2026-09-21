import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Loading from './components/Loading';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile lookup failed:', error.message);
        setUserProfile(null);
        return;
      }

      setUserProfile(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);

      if (nextSession?.user) {
        await fetchProfile(nextSession.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <Loading />;

  if (!session) {
    return <Login onLoginSuccess={fetchProfile} />;
  }

  const isAdmin = userProfile?.role === 'admin';

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar userProfile={userProfile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && <button type="button" className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
        <div className="main-wrapper">
          <Header
            title={isAdmin ? 'Admin Console' : 'Agent Operations'}
            userProfile={userProfile}
            onMenuToggle={() => setSidebarOpen((open) => !open)}
          />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={isAdmin ? <AdminDashboard /> : <AgentDashboard userProfile={userProfile} />}
              />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/create" element={<CreateTicket />} />
              <Route path="/tickets/:id" element={<TicketDetails userProfile={userProfile} />} />
              <Route
                path="/agents"
                element={isAdmin ? <Agents /> : <Navigate to="/" replace />}
              />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings userProfile={userProfile} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}