'use client';

import { Lock } from 'lucide-react';

interface ProofOfOwnershipProps {
  creatorUsername: string;
  timestamp: string;
}

export default function ProofOfOwnership({ creatorUsername, timestamp }: ProofOfOwnershipProps) {
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <div className="bg-slate border border-accent p-4 rounded">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-5 h-5 text-accent" />
        <span className="text-accent font-semibold text-sm">Proof of Ownership</span>
      </div>
      <p className="text-text-secondary text-sm">
        100% IP ownership resides with the creator <span className="text-accent font-semibold">{creatorUsername}</span> as of <span className="text-accent font-semibold">{formattedDate}</span>.
      </p>
    </div>
  );
}
