import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../AuthContext';
import AdminSidebar from './AdminSidebar';
import Headertheme from './Headertheme';
import { ThemeContext } from '../page/ThemeContext';
import { ToastContainer } from 'react-toastify';
import './admin.css';
import './analytics.css';

const Analytics = () => {
  const { username, isLoggedIn } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !username) return;
    axiosInstance
      .get(`/api/analytics/${username}/`)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [isLoggedIn, username]);

  // Bar chart max value
  const maxBar = data ? Math.max(...data.daily_data.map((d) => d.count), 1) : 1;

  const STAT_CARDS = data
    ? [
        { label: 'Total Visits',      value: data.total_visits,      color: '#6c63ff' },
        { label: 'Today',             value: data.today_visits,      color: '#10b981' },
        { label: 'This Month',        value: data.this_month_visits,  color: '#f59e0b' },
        { label: 'Last Month',        value: data.last_month_visits,  color: '#a855f7' },
      ]
    : [];

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar">

        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">Analytics</h1>
            <span className="admin-page-badge">Live Data</span>
          </div>
          <Headertheme />
          <ToastContainer />
        </div>

        <div className="admin-content">
          {!isLoggedIn && (
            <p className="login-warning">⚠️ Please login to view analytics.</p>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--adm-text-3)' }}>
              <div className="progress-bar" />
              Loading analytics...
            </div>
          )}

          {!loading && !data && (
            <div className="an-empty">
              <div className="an-empty-icon">📊</div>
              <h3>No data yet</h3>
              <p>Share your portfolio link and visits will appear here.</p>
              <button
                className="adm-btn-primary"
                onClick={() => {
                  const url = `https://showcraft.netlify.app/portfolio/${username}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                📋 Copy Portfolio Link
              </button>
            </div>
          )}

          {!loading && data && (
            <>
              {/* ── Stat cards ── */}
              <div className="an-stats-grid">
                {STAT_CARDS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="an-stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ '--card-color': s.color }}
                  >
                    <div className="an-stat-icon">{s.icon}</div>
                    <div className="an-stat-num">{s.value.toLocaleString()}</div>
                    <div className="an-stat-label">{s.label}</div>
                    {s.label === 'Today' && data.yesterday_visits > 0 && (
                      <div className="an-stat-trend" style={{
                        color: data.today_visits >= data.yesterday_visits ? '#10b981' : '#ef4444'
                      }}>
                        {data.today_visits >= data.yesterday_visits ? '↑' : '↓'}
                        {' '}vs yesterday ({data.yesterday_visits})
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* ── Bar chart — Last 7 days ── */}
              <motion.div
                className="adm-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="adm-card-header">
                  <div className="adm-card-title">
                    
                    Visits — Last 7 Days
                  </div>
                </div>
                <div className="adm-card-body">
                  <div className="an-bar-chart">
                    {data.daily_data.map((d, i) => (
                      <div className="an-bar-col" key={d.date}>
                        <div className="an-bar-count">{d.count}</div>
                        <motion.div
                          className="an-bar"
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max((d.count / maxBar) * 160, d.count > 0 ? 8 : 0)}px` }}
                          transition={{ duration: 0.6, delay: i * 0.07 }}
                          title={`${d.date}: ${d.count} visits`}
                        />
                        <div className="an-bar-label">{d.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── Bottom row ── */}
              <div className="an-bottom-grid">

                {/* Devices */}
                <motion.div
                  className="adm-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="adm-card-header">
                    <div className="adm-card-title">
                      <div className="adm-card-title-icon">📱</div>
                      Devices
                    </div>
                  </div>
                  <div className="adm-card-body">
                    {data.devices.length === 0 ? (
                      <p className="an-no-data">No device data yet</p>
                    ) : (
                      <div className="an-list">
                        {data.devices.map((d) => {
                          const icon = d.device === 'Mobile' ? '📱' : d.device === 'Tablet' ? '📟' : '🖥';
                          const pct  = data.total_visits > 0
                            ? Math.round((d.count / data.total_visits) * 100)
                            : 0;
                          return (
                            <div className="an-list-item" key={d.device}>
                              <span className="an-list-icon">{icon}</span>
                              <div className="an-list-info">
                                <div className="an-list-label">{d.device}</div>
                                <div className="an-list-bar-wrap">
                                  <motion.div
                                    className="an-list-bar"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.7 }}
                                  />
                                </div>
                              </div>
                              <span className="an-list-count">{d.count}</span>
                              <span className="an-list-pct">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Top Countries */}
                <motion.div
                  className="adm-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="adm-card-header">
                    <div className="adm-card-title">
                      <div className="adm-card-title-icon">🌍</div>
                      Top Countries
                    </div>
                  </div>
                  <div className="adm-card-body">
                    {data.top_countries.length === 0 ? (
                      <p className="an-no-data">No country data yet</p>
                    ) : (
                      <div className="an-list">
                        {data.top_countries.map((c, i) => {
                          const pct = data.total_visits > 0
                            ? Math.round((c.count / data.total_visits) * 100)
                            : 0;
                          return (
                            <div className="an-list-item" key={c.country}>
                              <span className="an-list-rank">#{i + 1}</span>
                              <div className="an-list-info">
                                <div className="an-list-label">{c.country || 'Unknown'}</div>
                                <div className="an-list-bar-wrap">
                                  <motion.div
                                    className="an-list-bar"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.7 }}
                                  />
                                </div>
                              </div>
                              <span className="an-list-count">{c.count}</span>
                              <span className="an-list-pct">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Browsers */}
                <motion.div
                  className="adm-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="adm-card-header">
                    <div className="adm-card-title">
                      <div className="adm-card-title-icon">🌐</div>
                      Browsers
                    </div>
                  </div>
                  <div className="adm-card-body">
                    {data.browsers.length === 0 ? (
                      <p className="an-no-data">No browser data yet</p>
                    ) : (
                      <div className="an-list">
                        {data.browsers.map((b) => {
                          const icons = { Chrome: '🟡', Firefox: '🟠', Safari: '🔵', Edge: '🔷', Opera: '🔴' };
                          const pct   = data.total_visits > 0
                            ? Math.round((b.count / data.total_visits) * 100)
                            : 0;
                          return (
                            <div className="an-list-item" key={b.browser}>
                              <span className="an-list-icon">{icons[b.browser] || '🌐'}</span>
                              <div className="an-list-info">
                                <div className="an-list-label">{b.browser}</div>
                                <div className="an-list-bar-wrap">
                                  <motion.div
                                    className="an-list-bar"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.7 }}
                                  />
                                </div>
                              </div>
                              <span className="an-list-count">{b.count}</span>
                              <span className="an-list-pct">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
