import { useParams }  from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header';
import Home   from '../components/home';
import About  from '../components/about';
import Work   from '../components/work';
import Form   from '../components/form';
import Footer from '../components/footer';
import Loading from './loading';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-production-2376.up.railway.app';

const getDevice = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua))                              return 'Tablet';
  if (/mobile|iphone|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'Mobile';
  return 'Desktop';
};

const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')  && !ua.includes('Edg'))  return 'Chrome';
  if (ua.includes('Firefox'))                          return 'Firefox';
  if (ua.includes('Safari')  && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg'))                              return 'Edge';
  if (ua.includes('Opera')   || ua.includes('OPR'))   return 'Opera';
  return 'Other';
};

const UserPortfolio = () => {
  const { username: identifier } = useParams(); // could be username OR custom slug

  const [realUsername, setRealUsername] = useState(null);
  const [resolving,    setResolving]    = useState(true);
  const [notFound,     setNotFound]     = useState(false);

  // ── Step 1: Resolve identifier → real username ─────────────
  useEffect(() => {
    if (!identifier) return;

    const resolve = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/portfolio/${identifier}/`);
        // PublicPortfolioView returns { username, slug, ... }
        setRealUsername(res.data.username);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          // Network error — fallback: treat identifier as username directly
          setRealUsername(identifier);
        }
      } finally {
        setResolving(false);
      }
    };

    resolve();
  }, [identifier]);

  // ── Step 2: Track visit once real username is known ─────────
  useEffect(() => {
    if (!realUsername) return;

    const trackVisit = async () => {
      try {
        let country = '';
        try {
          const geo = await fetch('https://ipapi.co/json/');
          const geoData = await geo.json();
          country = geoData.country_name || '';
        } catch { country = ''; }

        await axios.post(`${BASE_URL}/api/track-visit/`, {
          username: realUsername,
          country,
          device:   getDevice(),
          browser:  getBrowser(),
          section:  'home',
        });
      } catch (err) {
        // Silently fail — never break portfolio for tracking errors
        console.warn('Visit tracking failed silently:', err.message);
      }
    };

    trackVisit();
  }, [realUsername]);


  if (resolving) return <Loading />;


  if (notFound) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 20,
        background: 'var(--background)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 60 }}>🔍</div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 28, fontWeight: 800,
          color: 'var(--white-text-color)',
          margin: 0,
        }}>
          Portfolio Not Found
        </h2>
        <p style={{ color: 'var(--gray-text-color)', fontSize: 15, maxWidth: 360 }}>
          The portfolio <strong style={{ color: '#6c63ff' }}>{identifier}</strong> doesn't
          exist or the link may have changed.
        </p>
        <a
          href="/"
          style={{
            marginTop: 8,
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            color: 'white',
            borderRadius: '100px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ← Back to Home
        </a>
      </div>
    );
  }


  return (
    <>
      <Header username={realUsername} />
      <Home   username={realUsername} />
      <About  username={realUsername} />
      <Work   username={realUsername} />
      <Form   username={realUsername} />
      <Footer username={realUsername} />
    </>
  );
};

export default UserPortfolio;

