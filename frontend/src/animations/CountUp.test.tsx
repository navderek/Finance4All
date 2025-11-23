import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountUp } from './CountUp';

describe('CountUp', () => {
  it('renders initial value', () => {
    render(<CountUp end={100} start={0} duration={1} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('supports custom start value', () => {
    render(<CountUp end={100} start={50} duration={1} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('supports prefix', () => {
    render(<CountUp end={100} start={100} prefix="$" duration={1} />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it('supports suffix', () => {
    render(<CountUp end={100} start={100} suffix="%" duration={1} />);
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it('supports prefix and suffix together', () => {
    render(<CountUp end={100} start={100} prefix="$" suffix=" USD" duration={1} />);
    const text = screen.getByText(/\$.*USD/);
    expect(text).toBeInTheDocument();
  });

  it('supports className prop', () => {
    const { container } = render(<CountUp end={100} className="test-class" duration={1} />);
    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });

  it('formats zero correctly', () => {
    render(<CountUp end={0} decimals={2} />);
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  it('formats decimal places correctly', () => {
    render(<CountUp end={99.99} start={99.99} decimals={2} />);
    expect(screen.getByText('99.99')).toBeInTheDocument();
  });

  it('formats thousand separator correctly', () => {
    render(<CountUp end={10000} start={10000} separator="," />);
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('formats custom separator correctly', () => {
    render(<CountUp end={10000} start={10000} separator="." />);
    expect(screen.getByText('10.000')).toBeInTheDocument();
  });

  it('formats large numbers with separator', () => {
    render(<CountUp end={1000000} start={1000000} separator="," />);
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
  });

  it('formats decimal numbers with separator', () => {
    render(<CountUp end={1234.56} start={1234.56} decimals={2} separator="," />);
    expect(screen.getByText('1,234.56')).toBeInTheDocument();
  });

  it('combines all formatting options', () => {
    render(
      <CountUp
        end={123456.78}
        start={123456.78}
        decimals={2}
        prefix="$"
        suffix=" USD"
        separator=","
      />
    );
    expect(screen.getByText('$123,456.78 USD')).toBeInTheDocument();
  });
});
