import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentTable from '../StudentTable';

describe('StudentTable', () => {
  const mockStudents = [
    {
      idstagiaires: 1,
      prenom: 'Jean',
      nom: 'Dupont',
      points: 5,
      vgood: 2, vgood_pct: 40,
      good: 1, good_pct: 20,
      nogood: 1, nogood_pct: 20,
      absent: 1, absent_pct: 20,
      sorties: 5,
      sortie_pct: 50,
    },
    {
      idstagiaires: 2,
      prenom: 'Marie',
      nom: 'Martin',
      points: 3,
      vgood: 1, vgood_pct: 33,
      good: 1, good_pct: 33,
      nogood: 0, nogood_pct: 0,
      absent: 1, absent_pct: 33,
      sorties: 3,
      sortie_pct: 30,
    },
  ];

  it('renders empty message when no students', () => {
    render(<StudentTable students={[]} stats={{}} />);
    expect(screen.getByText('Aucun stagiaire.')).toBeInTheDocument();
  });

  it('renders empty message when students is null', () => {
    render(<StudentTable students={null} stats={{}} />);
    expect(screen.getByText('Aucun stagiaire.')).toBeInTheDocument();
  });

  it('renders student names (first name + initial)', () => {
    render(<StudentTable students={mockStudents} stats={{}} />);
    expect(screen.getByText('Jean D.')).toBeInTheDocument();
    expect(screen.getByText('Marie M.')).toBeInTheDocument();
  });

  it('renders row numbers starting at 1', () => {
    render(<StudentTable students={mockStudents} stats={{}} />);
    const thElements = screen.getAllByRole('rowheader');
    expect(thElements[0]).toHaveTextContent('1');
    expect(thElements[1]).toHaveTextContent('2');
  });

  it('does not render Action column without onSelectStudent', () => {
    render(<StudentTable students={mockStudents} stats={{}} />);
    expect(screen.queryByText('Action')).not.toBeInTheDocument();
    expect(screen.queryByText('Choisir')).not.toBeInTheDocument();
  });

  it('renders Action column with onSelectStudent', () => {
    render(
      <StudentTable students={mockStudents} stats={{}} onSelectStudent={() => {}} />
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getAllByText('Choisir')).toHaveLength(2);
  });

  it('calls onSelectStudent with student on Choisir click', () => {
    const onSelect = vi.fn();
    render(
      <StudentTable students={mockStudents} stats={{}} onSelectStudent={onSelect} />
    );
    fireEvent.click(screen.getAllByText('Choisir')[0]);
    expect(onSelect).toHaveBeenCalledWith(mockStudents[0]);
  });
});
