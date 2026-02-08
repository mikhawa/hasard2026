import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LogsTable from '../LogsTable';

describe('LogsTable', () => {
  const mockLogs = [
    {
      idreponseslog: 1,
      reponseslogdate: '2026-01-15 10:30:00',
      prenom: 'Jean',
      nom: 'Dupont',
      reponseslogcol: 3,
      remarque: 'Excellent',
      username: 'prof1',
    },
    {
      idreponseslog: 2,
      reponseslogdate: '2026-01-15 10:35:00',
      prenom: 'Marie',
      nom: 'Martin',
      reponseslogcol: 0,
      remarque: '',
      username: 'prof1',
    },
  ];

  it('renders empty message when no logs', () => {
    render(<LogsTable logs={[]} />);
    expect(screen.getByText('Aucun log.')).toBeInTheDocument();
  });

  it('renders empty message when logs is null', () => {
    render(<LogsTable logs={null} />);
    expect(screen.getByText('Aucun log.')).toBeInTheDocument();
  });

  it('renders log entries with student names', () => {
    render(<LogsTable logs={mockLogs} />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
  });

  it('maps response codes to labels', () => {
    render(<LogsTable logs={mockLogs} />);
    expect(screen.getByText('Tres bien')).toBeInTheDocument();
    expect(screen.getByText('Absent')).toBeInTheDocument();
  });

  it('applies correct badge colors', () => {
    render(<LogsTable logs={mockLogs} />);
    expect(screen.getByText('Tres bien')).toHaveClass('bg-primary');
    expect(screen.getByText('Absent')).toHaveClass('bg-warning');
  });

  it('displays dash for empty remarks', () => {
    render(<LogsTable logs={mockLogs} />);
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('renders dates and professor names', () => {
    render(<LogsTable logs={mockLogs} />);
    expect(screen.getByText('2026-01-15 10:30:00')).toBeInTheDocument();
    expect(screen.getAllByText('prof1')).toHaveLength(2);
  });
});
