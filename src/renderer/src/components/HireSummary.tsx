import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'react';

export interface HireSummaryProps {
  name: string;
  role: string;
  folder: string;
  provider: string;
  model?: string;
  mailbox?: string;
  connector?: string;
  starterJobs?: number;
  firstTask?: string;
}

const card: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'max-content minmax(0, 1fr)',
  gap: '7px 14px',
  padding: 12,
  borderRadius: 'var(--cth-r-md)',
  background: 'var(--cth-card-2)',
  boxShadow: 'inset 0 0 0 1px var(--cth-line)',
  fontSize: 12.5,
  lineHeight: '18px',
  color: 'var(--cth-ink)'
};

const labelStyle: CSSProperties = {
  fontSize: 10,
  lineHeight: '14px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'var(--cth-ink-3)'
};

const valueStyle: CSSProperties = {
  minWidth: 0,
  overflowWrap: 'anywhere'
};

export function HireSummary({
  name,
  role,
  folder,
  provider,
  model,
  mailbox,
  connector,
  starterJobs = 0,
  firstTask
}: HireSummaryProps) {
  const { t } = useTranslation();

  const valueOrFallback = (value: string | undefined): string =>
    value?.trim() || t('hireSummary.notSet');

  return (
    <section
      aria-label={t('hireSummary.label')}
      style={card}
    >
      <span style={labelStyle}>{t('hireSummary.name')}</span>
      <strong style={valueStyle}>{valueOrFallback(name)}</strong>

      <span style={labelStyle}>{t('hireSummary.role')}</span>
      <span style={valueStyle}>{valueOrFallback(role)}</span>

      <span style={labelStyle}>{t('hireSummary.folder')}</span>
      <code style={valueStyle}>{valueOrFallback(folder)}</code>

      <span style={labelStyle}>{t('hireSummary.engine')}</span>
      <span style={valueStyle}>
        {valueOrFallback(provider)}
        {model?.trim() ? `, ${model.trim()}` : ''}
      </span>

      <span style={labelStyle}>{t('hireSummary.mailbox')}</span>
      <span style={valueStyle}>
        {mailbox?.trim() || t('hireSummary.none')}
      </span>

      <span style={labelStyle}>{t('hireSummary.connection')}</span>
      <span style={valueStyle}>
        {connector?.trim() || t('hireSummary.none')}
      </span>

      <span style={labelStyle}>{t('hireSummary.starterJobs')}</span>
      <span style={valueStyle}>{starterJobs}</span>

      {firstTask?.trim() && (
        <>
          <span style={labelStyle}>{t('hireSummary.firstTask')}</span>
          <span style={valueStyle}>{firstTask.trim()}</span>
        </>
      )}
    </section>
  );
}