import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Loading from './components/Loading';

import LandingPage from './pages/LandingPage';
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

  const fetchProfile = async (currentSession) => {
    if (!currentSession?.user) {
      setUserProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentSession.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      setUserProfile(null);
    } else {
      setUserProfile(data);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);

      if (data.session) {
        await fetchProfile(data.session);
      }

      setLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession) {
        await fetchProfile(newSession);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      {!session ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={fetchProfile} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Sidebar userProfile={userProfile} />

          <div className="main-content">
            <Header userProfile={userProfile} />

            <Routes>
              <Route
                path="/"
                element={
                  userProfile?.role === 'admin' ? (
                    <AdminDashboard />
                  ) : (
                    <AgentDashboard userProfile={userProfile} />
                  )
                }
              />

              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/create" element={<CreateTicket />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}