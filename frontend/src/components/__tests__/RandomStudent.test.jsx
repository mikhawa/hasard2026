import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RandomStudent from '../RandomStudent';

describe('RandomStudent', () => {
  it('renders nothing when student is null', () => {
    const { container } = render(<RandomStudent student={null} onRefresh={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders student name', () => {
    render(
      <RandomStudent student={{ prenom: 'Jean', nom: 'Dupont' }} onRefresh={() => {}} />
    );
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <RandomStudent student={{ prenom: 'Jean', nom: 'Dupont' }} onRefresh={() => {}} />
    );
    expect(screen.getByText('Stagiaire au hasard')).toBeInTheDocument();
  });

  it('calls onRefresh when button is clicked', () => {
    const onRefresh = vi.fn();
    render(
      <RandomStudent student={{ prenom: 'Jean', nom: 'Dupont' }} onRefresh={onRefresh} />
    );
    fireEvent.click(screen.getByText('Nouveau tirage'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
