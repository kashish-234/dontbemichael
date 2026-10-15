import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'react';

export interface CapabilitiesSummaryProps {
  emailLabel: string;
  connectorCount: number;
  connectorTotal: number;
  schedulesOn: number;
  pendingRestart: boolean;
}

const root: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 8,
  margin: '10px 0 14px'
};

const item: CSSProperties = {
  minWidth: 0,
  padding: '9px 10px',
  borderRadius: 'var(--cth-r-md)',
  background: 'var(--cth-card-2)',
  boxShadow: 'inset 0 0 0 1px var(--cth-line)',
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

const labelStyle: CSSProperties = {
  fontSize: 10,
  lineHeight: '13px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'var(--cth-ink-3)'
};

const valueStyle: CSSProperties = {
  minWidth: 0,
  fontSize: 12.5,
  lineHeight: '17px',
  overflowWrap: 'anywhere',
  color: 'var(--cth-ink)'
};

export function CapabilitiesSummary({
  emailLabel,
  connectorCount,
  connectorTotal,
  schedulesOn,
  pendingRestart
}: CapabilitiesSummaryProps) {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('capabilitiesSummary.label')}
      style={root}
    >
      <div style={item}>
        <span style={labelStyle}>{t('capabilitiesSummary.email')}</span>
        <span style={valueStyle}>{emailLabel}</span>
      </div>

      <div style={item}>
        <span style={labelStyle}>
          {t('capabilitiesSummary.connections')}
        </span>
        <span style={valueStyle}>
          {connectorCount} / {connectorTotal}
        </span>
      </div>

      <div style={item}>
        <span style={labelStyle}>
          {t('capabilitiesSummary.schedules')}
        </span>
        <span style={valueStyle}>
          {t('capabilitiesSummary.active', { count: schedulesOn })}
        </span>
      </div>

      {pendingRestart && (
        <div
          role="status"
          style={{
            gridColumn: '1 / -1',
            padding: '8px 10px',
            borderRadius: 'var(--cth-r-md)',
            background: 'var(--cth-amber-soft)',
            color: 'var(--cth-ink)',
            fontSize: 12.5,
            lineHeight: '18px'
          }}
        >
          {t('capabilitiesSummary.restartNeeded')}
        </div>
      )}
    </div>
  );
}