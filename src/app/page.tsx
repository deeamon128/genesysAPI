'use client';  // this makes it a client component so you can use hooks

import { useState, useEffect } from 'react';

export default function TestGenesys() {
  const [availableAgents, setAvailableAgents] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agents')  // call your backend route
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => setAvailableAgents(data.availableAgents))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (availableAgents === null) return <div>Loading...</div>;

  return <div>Available Agents: {availableAgents}</div>;
}
