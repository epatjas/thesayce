'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Redirect to Tina admin
    window.location.href = '/admin/index.html';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Loading admin...</p>
    </div>
  );
}
