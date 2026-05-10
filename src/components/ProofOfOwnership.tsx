'use client';

import { Lock } from 'lucide-react';

interface ProofOfOwnershipProps {
  creatorUsername: string;
  timestamp: string;
}

export default function ProofOfOwnership({
  creatorUsername,
  timestamp,
}: ProofOfOwnershipProps) {
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate border border-accent rounded">
      <Lock className="w-4 h-4 text-accent" />
      <div>
        <p className="text-xs text-text-secondary">Proof of Ownership</p>
        <p className="text-sm text-accent font-semibold">
          {creatorUsername} • {formattedDate}
        </p>
      </div>
    </div>
  );
}
