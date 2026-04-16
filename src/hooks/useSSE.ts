'use client';
import { useEffect, useRef, useState } from 'react';

export type SSEStatus = 'connecting' | 'open' | 'closed' | 'error';

export function useSSE<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<SSEStatus>('connecting');
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setStatus('open');
    es.onmessage = (e: MessageEvent) => {
      try {
        setData(JSON.parse(e.data) as T);
      } catch {
        // ignore malformed frames
      }
    };
    es.onerror = () => {
      setStatus('error');
      es.close();
    };

    return () => {
      es.close();
      setStatus('closed');
    };
  }, [url]);

  const reconnect = () => {
    esRef.current?.close();
    setStatus('connecting');
    const es = new EventSource(url);
    esRef.current = es;
    es.onopen = () => setStatus('open');
    es.onmessage = (e) => {
      try {
        setData(JSON.parse(e.data) as T);
      } catch {
        // ignore
      }
    };
    es.onerror = () => {
      setStatus('error');
      es.close();
    };
  };

  return { data, status, reconnect };
}
