import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart2,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Minus,
  Plus,
  Settings,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import './LandingPage.css';

const workflowSteps = [
  {
    icon: Ticket,
    title: 'Create a Ticket',
    description: 'Capture customer issues in a structured support ticket.',
  },
  {
    icon: UserRound,
    title: 'Assign an Agent',
    description: 'Give each request clear ownership.',
  },
  {
    icon: Activity,
    title: 'Track Progress',
    description: 'Update status and add comments as work progresses.',
  },
  {
    icon: CheckCircle2,
    title: 'Resolve & Review',
    description: 'Complete the request and review team activity.',
  },
];

const features = [
  {
    icon: Ticket,
    title: 'Centralized Ticket Management',
    description: 'Keep support requests organized with clear status, priority, and ownership.',
  },
  {
    icon: Users,
    title: 'Smart Agent Workflow',
    description: 'Assign tickets to agents and keep responsibility visible as work moves along.',
  },
  {
    icon: MessageSquare,
    title: 'Ticket Activity & Comments',
    description: 'Keep comments and updates connected to the ticket they belong to.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description: 'Role-aware dashboards and navigation support distinct admin and agent workflows.',
  },
  {
    icon: BarChart2,
    title: 'Reports & Insights',
    description: 'Review ticket activity by status, priority, category, and agent.',
  },
  {
    icon: UserRound,
    title: 'Simple Team Management',
    description: 'Administrators can review agent profiles, roles, and ticket workload.',
  },
];

const faqs = [
  {
    question: 'What is RicozDesk?',
    answer:
      'RicozDesk is a support operations workspace for managing customer tickets, assigning agents, tracking updates, and reviewing reports.',
  },
  {
    question: 'How does ticket assignment work?',
    answer:
      'A ticket can be assigned when it is created or updated later from its details page. The ticket record shows its current assignment.',
  },
  {
    question: 'Can agents see all tickets?',
    answer:
      'The agent dashboard focuses on tickets assigned to the signed-in agent. Ticket-list access is also subject to the permissions configured for your account in Supabase.',
  },
  {
    question: 'Can I track ticket progress and comments?',
    answer:
      'Yes. Ticket details show the current status and the comments recorded for that ticket.',
  },
  {
    question: 'What can administrators manage?',
    answer:
      'Administrators have an agent-management view for reviewing agent profiles, roles, and assigned-ticket workload, along with the admin dashboard and reporting views.',
  },
  {
    question: 'How can I sign in to RicozDesk?',
    answer:
      'Choose Sign In or Get Started to open the existing login page, then use the account credentials provided for your RicozDesk workspace.',
  },
];

function Brand({ footer = false }) {
  return (
    <span className={`landing-brand${footer ? ' landing-brand-footer' : ''}`}>
      <span className="landing-brand-mark" aria-hidden="true">rZ</span>
      <span className="landing-brand-name">RicozDesk</span>
    </span>
  );
}

function DashboardPreview() {
  const previewTickets = [
    { title: 'Unable to update account details', priority: 'High', status: 'In Progress', agent: 'Jordan Lee' },
    { title: 'Question about a recent invoice', priority: 'Normal', status: 'Open', agent: 'Maya Chen' },
    { title: 'Access request follow-up', priority: 'Low', status: 'Resolved', agent: 'Alex Morgan' },
  ];

  return (
    <div className="preview-wrap" aria-label="Illustrative RicozDesk dashboard preview">
      <div className="preview-browser">
        <div className="preview-browser-bar" aria-hidden="true">
          <span /><span /><span />
          <div className="preview-address">app.ricozdesk</div>
        </div>

        <div className="preview-app">
          <aside className="preview-sidebar" aria-label="Illustrative dashboard navigation">
            <Brand />
            <span className="preview-sidebar-label">WORKSPACE</span>
            <div className="preview-nav-item preview-nav-active"><LayoutDashboard />Dashboard</div>
            <div className="preview-nav-item"><Ticket />Tickets</div>
            <div className="preview-nav-item"><Users />Agents</div>
            <div className="preview-nav-item"><BarChart2 />Reports</div>
            <div className="preview-nav-item"><Settings />Settings</div>
            <div className="preview-sidebar-profile">
              <span className="preview-avatar">JD</span>
              <span><strong>Jordan Davis</strong><small>Admin</small></span>
            </div>
          </aside>

          <div className="preview-main">
            <div className="preview-heading">
              <div>
                <span className="preview-eyebrow">OVERVIEW</span>
                <h2>Support dashboard</h2>
              </div>
              <span className="preview-date"><Clock3 />Workspace view</span>
            </div>

            <div className="preview-kpis">
              <div className="preview-kpi">
                <span>Open tickets</span>
                <strong><Ticket />Queue</strong>
                <small>Review active requests</small>
              </div>
              <div className="preview-kpi">
                <span>Resolved tickets</span>
                <strong><CheckCircle2 />History</strong>
                <small>Completed requests</small>
              </div>
              <div className="preview-kpi">
                <span>Active agents</span>
                <strong><Users />Team</strong>
                <small>Assignments and workload</small>
              </div>
              <div className="preview-kpi">
                <span>Resolution rate</span>
                <strong><BarChart2 />Reports</strong>
                <small>Explore ticket activity</small>
              </div>
            </div>

            <div className="preview-table-card">
              <div className="preview-table-heading">
                <div><h3>Recent tickets</h3><p>Sample layout for illustration only</p></div>
                <span>Ticket overview</span>
              </div>
              <div className="preview-table-scroll">
                <table className="preview-table">
                  <thead>
                    <tr><th>Ticket</th><th>Priority</th><th>Status</th><th>Assigned agent</th></tr>
                  </thead>
                  <tbody>
                    {previewTickets.map((ticket) => (
                      <tr key={ticket.title}>
                        <td><span className="preview-ticket-icon"><Ticket /></span>{ticket.title}</td>
                        <td><span className={`preview-priority preview-priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></td>
                        <td><span className={`preview-status preview-status-${ticket.status.toLowerCase().replace(' ', '-')}`}><i />{ticket.status}</span></td>
                        <td><span className="preview-agent-avatar">{ticket.agent.split(' ').map((part) => part[0]).join('')}</span>{ticket.agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="preview-note"><span />Illustrative preview · not connected to live data</div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('.landing-reveal');

    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    document.getElementById(sectionId)?.scrollIntoView({ behavior });
    setMenuOpen(false);
  };

  const goToLogin = () => {
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <main className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav" aria-label="Main navigation">
          <a className="landing-brand-link" href="#top" aria-label="RicozDesk home">
            <Brand />
          </a>

          <button
            className="landing-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div className={`landing-nav-links${menuOpen ? ' landing-nav-links-open' : ''}`}>
            <button type="button" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button type="button" onClick={() => scrollToSection('features')}>Features</button>
            <button type="button" onClick={() => scrollToSection('why-ricozdesk')}>Why RicozDesk</button>
            <button type="button" onClick={() => scrollToSection('faqs')}>FAQs</button>
          </div>

          <div className="landing-nav-actions">
            <button className="landing-button landing-button-outline landing-nav-sign-in" type="button" onClick={goToLogin}>Sign In</button>
            <button className="landing-button landing-button-primary landing-nav-start" type="button" onClick={goToLogin}>
              Get Started <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <section className="landing-hero" id="top">
        <div className="landing-hero-inner">
          <div className="hero-copy landing-reveal">
            <span className="hero-badge"><span />SMART CUSTOMER SUPPORT OPERATIONS</span>
            <h1>Every Customer Request.<br /><span>Handled Better.</span></h1>
            <p>
              Bring customer requests, support agents, ticket assignments, and performance insights together in one simple workspace. Help your team resolve issues faster and deliver a better customer experience.
            </p>
            <div className="hero-actions">
              <button className="landing-button landing-button-primary" type="button" onClick={goToLogin}>
                Get Started <ArrowRight aria-hidden="true" />
              </button>
              <button className="landing-button landing-button-outline" type="button" onClick={() => scrollToSection('how-it-works')}>
                See How It Works
              </button>
            </div>
            <div className="hero-trust"><Check aria-hidden="true" />One workspace. Clear ownership. Better support.</div>
          </div>
          <div className="hero-preview landing-reveal">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="benefits-strip" aria-label="RicozDesk benefits">
        <div className="benefits-inner">
          <div><span>01</span><strong>Centralized</strong><p>All support requests in one place.</p></div>
          <div><span>02</span><strong>Role-Based</strong><p>Clear admin and agent access.</p></div>
          <div><span>03</span><strong>Trackable</strong><p>Ticket status and activity visibility.</p></div>
          <div><span>04</span><strong>Actionable</strong><p>Reports to support better decisions.</p></div>
        </div>
      </section>

      <section className="landing-section how-section" id="how-it-works">
        <div className="landing-section-heading landing-reveal">
          <span className="landing-eyebrow">A CLEARER WAY TO WORK</span>
          <h2>A Smoother Journey From Request to Resolution</h2>
          <p>Every request follows a clear workflow, helping your team stay organized and customers stay informed.</p>
        </div>
        <div className="workflow-grid">
          {workflowSteps.map(({ icon: Icon, title, description }, index) => (
            <article className="workflow-card landing-reveal" key={title}>
              <span className="workflow-number">0{index + 1}</span>
              <span className="landing-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section features-section" id="features">
        <div className="landing-section-heading landing-reveal">
          <span className="landing-eyebrow">BUILT FOR SUPPORT TEAMS</span>
          <h2>Everything Your Support Team Needs</h2>
          <p>A centralized workspace designed to simplify support operations and improve visibility across your team.</p>
        </div>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, description }) => (
            <article className="feature-card landing-reveal" key={title}>
              <span className="landing-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section" id="why-ricozdesk">
        <div className="why-visual landing-reveal" aria-hidden="true">
          <div className="why-visual-card">
            <span className="why-visual-mark">rZ</span>
            <div className="why-visual-title"><strong>Support overview</strong><span>Workspace activity</span></div>
            <div className="why-visual-row"><span><i className="why-dot why-dot-red" />Open</span><b>In progress</b></div>
            <div className="why-visual-row"><span><i className="why-dot why-dot-amber" />Assigned</span><b>Agent owner</b></div>
            <div className="why-visual-row"><span><i className="why-dot why-dot-green" />Resolved</span><b>Activity saved</b></div>
            <div className="why-visual-footer"><Activity /> Ticket activity stays connected</div>
          </div>
        </div>
        <div className="why-copy landing-reveal">
          <span className="landing-eyebrow">WHY RICOZDESK</span>
          <h2>Built for Clearer, More Reliable Support</h2>
          <p className="why-intro">Keep ticket details, ownership, and team activity together in a workspace designed for day-to-day support operations.</p>
          <div className="why-points">
            <article><span className="why-check"><Check /></span><div><h3>Clear Ownership</h3><p>Make it easier to understand who is handling each request.</p></div></article>
            <article><span className="why-check"><Check /></span><div><h3>Better Visibility</h3><p>View ticket statuses and team activity from one workspace.</p></div></article>
            <article><span className="why-check"><Check /></span><div><h3>Organized Workflows</h3><p>Keep updates and ticket details connected.</p></div></article>
          </div>
        </div>
      </section>

      <section className="landing-section journey-section">
        <div className="landing-section-heading landing-reveal">
          <span className="landing-eyebrow">FROM FIRST MESSAGE TO FOLLOW-UP</span>
          <h2>A Clear View of Every Request</h2>
          <p>Follow the work as a customer request moves through the support process.</p>
        </div>
        <div className="journey-track landing-reveal">
          {[
            ['Customer Request', CircleHelp],
            ['Ticket Created', Ticket],
            ['Agent Assigned', Users],
            ['Work In Progress', Clock3],
            ['Resolved', CheckCircle2],
          ].map(([label, Icon], index, stages) => (
            <React.Fragment key={label}>
              <div className={`journey-stage${index === stages.length - 1 ? ' journey-stage-complete' : ''}`}>
                <span><Icon aria-hidden="true" /></span><strong>{label}</strong>
              </div>
              {index < stages.length - 1 && <span className="journey-connector" aria-hidden="true"><ArrowRight /></span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="landing-section faq-section" id="faqs">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">A FEW QUICK ANSWERS</span>
          <h2>Frequently Asked Questions</h2>
          <p>Learn how RicozDesk brings ticket and team workflows together.</p>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openFaq === index;
            const answerId = `faq-answer-${index}`;

            return (
              <article className={`faq-item${isOpen ? ' faq-item-open' : ''}`} key={question}>
                <h3>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{question}</span>
                    {isOpen ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
                  </button>
                </h3>
                <div className="faq-answer" id={answerId} hidden={!isOpen}>
                  <p>{answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-cta-card landing-reveal">
          <span className="landing-eyebrow">READY WHEN YOU ARE</span>
          <h2>Make Every Customer Interaction Count.</h2>
          <p>Bring your support workflow into one organized workspace and help your team handle requests with clarity.</p>
          <div className="landing-cta-actions">
            <button className="landing-button landing-button-primary" type="button" onClick={goToLogin}>Get Started <ArrowRight aria-hidden="true" /></button>
            <button className="landing-button landing-button-outline" type="button" onClick={goToLogin}>Sign In</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <div className="landing-footer-brand">
            <a className="landing-brand-link" href="#top" aria-label="RicozDesk home"><Brand footer /></a>
            <p>A centralized workspace for managing support tickets, coordinating agents, and gaining visibility into customer support operations.</p>
          </div>
          <nav className="landing-footer-links" aria-label="Footer navigation">
            <strong>Explore</strong>
            <button type="button" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button type="button" onClick={() => scrollToSection('features')}>Features</button>
            <button type="button" onClick={() => scrollToSection('faqs')}>FAQs</button>
            <button type="button" onClick={goToLogin}>Sign In</button>
          </nav>
        </div>
        <div className="landing-footer-bottom"><span>RicozDesk</span><span>Customer support, clearly connected.</span></div>
      </footer>
    </main>
  );
}