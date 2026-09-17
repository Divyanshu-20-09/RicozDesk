import React from 'react';

export default function PriorityBadge({ priority }) {
  const normalized = (priority || 'Low').toLowerCase();
  return (
    <span className={`badge badge-${normalized}`}>
      {priority}
    </span>
  );
}