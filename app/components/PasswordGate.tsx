'use client';

import { useState, useEffect } from 'react';
import styles from './PasswordGate.module.css';

const SITE_PASSWORD = 'lili2025';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('site-access');
    if (stored === 'granted') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem('site-access', 'granted');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1 className={styles.title}>Coming Soon</h1>
        <p className={styles.subtitle}>This site is currently under construction.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>
            Enter
          </button>
        </form>
        {error && <p className={styles.error}>Incorrect password</p>}
      </div>
    </div>
  );
}
