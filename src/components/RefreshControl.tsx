'use client';
import { useState, useEffect } from 'react';

interface RefreshControlProps {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: Date | null;
  autoRefreshSecs?: number;
}

export function RefreshControl({
  onRefresh,
  loading,
  lastUpdated,
  autoRefreshSecs = 60,
}: RefreshControlProps) {
  const [countdown, setCountdown] = useState(autoRefreshSecs);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          return autoRefreshSecs;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [autoRefreshSecs]);

  useEffect(() => {
    if (lastUpdated) setCountdown(autoRefreshSecs);
  }, [lastUpdated, autoRefreshSecs]);

  return (
    <div className="flex items-center gap-3 text-xs text-slate-400">
      {lastUpdated && (
        <span>
          Updated {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      )}
      <span className="text-slate-600">
        Auto-refresh in {countdown}s
      </span>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e91e8c]/15 hover:bg-[#e91e8c]/25 text-[#e91e8c] rounded-lg transition-all disabled:opacity-50 font-medium"
      >
        <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
        {loading ? '새로고침 중…' : '지금 새로고침'}
      </button>
    </div>
  );
}
