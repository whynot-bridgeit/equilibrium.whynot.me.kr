import type { Alert } from '@/types';

const severityStyles = {
  info: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  critical: 'border-red-500/40 bg-red-500/10 text-red-300',
  success: 'border-green-500/40 bg-green-500/10 text-green-300',
};

const severityIcon = {
  info: 'ℹ',
  warning: '⚠',
  critical: '🚨',
  success: '✅',
};

export function AlertBanner({ alert }: { alert: Alert }) {
  return (
    <div
      className={`border rounded-lg p-3 text-sm flex gap-3 ${severityStyles[alert.severity]}`}
    >
      <span className="text-base shrink-0">{severityIcon[alert.severity]}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="font-semibold">{alert.title}</div>
        <div className="text-xs opacity-80">{alert.description}</div>
        {alert.action && (
          <div className="text-xs mt-1 font-medium opacity-90">
            → {alert.action}
          </div>
        )}
        <div className="text-xs opacity-50 mt-1">
          {new Date(alert.timestamp).toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
