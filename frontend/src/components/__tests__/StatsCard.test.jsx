import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  const mockStats = {
    sorties: 25,
    vgood: 10,
    vgood_pct: 40,
    good: 8,
    good_pct: 32,
    nogood: 4,
    nogood_pct: 16,
    absent: 3,
    absent_pct: 12,
  };

  it('renders stats correctly', () => {
    render(<StatsCard stats={mockStats} />);
    expect(screen.getByText(/25/)).toBeInTheDocument();
    expect(screen.getByText(/40%/)).toBeInTheDocument();
    expect(screen.getByText(/32%/)).toBeInTheDocument();
    expect(screen.getByText(/16%/)).toBeInTheDocument();
    expect(screen.getByText(/12%/)).toBeInTheDocument();
  });

  it('renders nothing when stats is null', () => {
    const { container } = render(<StatsCard stats={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when stats is undefined', () => {
    const { container } = render(<StatsCard stats={undefined} />);
    expect(container.innerHTML).toBe('');
  });

  it('displays "Nombre de questions" label', () => {
    render(<StatsCard stats={mockStats} />);
    expect(screen.getByText(/Nombre de questions/)).toBeInTheDocument();
  });
});
