import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || 'Open').toLowerCase().replace(' ', '_');
  return (
    <span className={`badge badge-${normalized}`}>
      {status}
    </span>
  );
}