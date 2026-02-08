import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('renders nothing for single page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders page buttons for multiple pages', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Precedent')).toBeInTheDocument();
    expect(screen.getByText('Suivant')).toBeInTheDocument();
  });

  it('marks current page as active', () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />
    );
    const page2Button = screen.getByText('2');
    expect(page2Button.closest('li')).toHaveClass('active');
  });

  it('disables Previous on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
    );
    const prevLi = screen.getByText('Precedent').closest('li');
    expect(prevLi).toHaveClass('disabled');
  });

  it('disables Next on last page', () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />
    );
    const nextLi = screen.getByText('Suivant').closest('li');
    expect(nextLi).toHaveClass('disabled');
  });

  it('calls onPageChange when page button is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page on Suivant click', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText('Suivant'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
