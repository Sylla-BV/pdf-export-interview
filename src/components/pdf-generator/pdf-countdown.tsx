'use client';

import React, { useState, useEffect } from 'react';

interface PdfCountdownProps {
  expiresAt: Date;
  onExpire: () => void;
}

const INTERVAL = 1000;

const PdfCountdown: React.FC<PdfCountdownProps> = ({ expiresAt, onExpire }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = expiresAt.getTime();
      const remaining = Math.max(0, expiry - now);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        onExpire();
      }
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0
      ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      : `${remainingSeconds}s`;
  };

  if (timeRemaining <= 0) {
    return null;
  }

  return (
    <div className='text-muted-foreground text-sm'>
      PDF expires in: <span className='font-mono'>{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default PdfCountdown;
