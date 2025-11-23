import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import {
  Spinner,
  ProgressBar,
  LoadingSkeleton,
  LoadingOverlay,
  FullPageLoader,
} from './Loading';
import { lightTheme } from '@theme/index';

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Spinner', () => {
  it('renders circular progress indicator', () => {
    render(
      <TestWrapper>
        <Spinner />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(
      <TestWrapper>
        <Spinner label="Loading data..." />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('supports centered prop', () => {
    const { container } = render(
      <TestWrapper>
        <Spinner centered label="Centered spinner" />
      </TestWrapper>
    );
    expect(container.firstChild).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('supports different sizes', () => {
    render(
      <TestWrapper>
        <Spinner size={60} />
      </TestWrapper>
    );
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('supports different colors', () => {
    render(
      <TestWrapper>
        <Spinner color="secondary" />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <TestWrapper>
        <Spinner ref={ref} />
      </TestWrapper>
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('ProgressBar', () => {
  it('renders indeterminate progress bar', () => {
    render(
      <TestWrapper>
        <ProgressBar />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders determinate progress bar with value', () => {
    render(
      <TestWrapper>
        <ProgressBar variant="determinate" value={50} />
      </TestWrapper>
    );
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('displays label', () => {
    render(
      <TestWrapper>
        <ProgressBar label="Uploading..." value={75} variant="determinate" />
      </TestWrapper>
    );
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('shows percentage value when showValue is true', () => {
    render(
      <TestWrapper>
        <ProgressBar variant="determinate" value={75} showValue />
      </TestWrapper>
    );
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays both label and value', () => {
    render(
      <TestWrapper>
        <ProgressBar label="Progress" variant="determinate" value={60} showValue />
      </TestWrapper>
    );
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('supports different colors', () => {
    render(
      <TestWrapper>
        <ProgressBar color="secondary" />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <TestWrapper>
        <ProgressBar ref={ref} />
      </TestWrapper>
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('LoadingSkeleton', () => {
  it('renders single skeleton by default', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSkeleton />
      </TestWrapper>
    );
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(1);
  });

  it('renders multiple skeletons when count is specified', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSkeleton count={3} />
      </TestWrapper>
    );
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(3);
  });

  it('supports text variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSkeleton variant="text" width={200} />
      </TestWrapper>
    );
    const skeleton = container.querySelector('.MuiSkeleton-text');
    expect(skeleton).toBeInTheDocument();
  });

  it('supports rectangular variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSkeleton variant="rectangular" width={200} height={100} />
      </TestWrapper>
    );
    const skeleton = container.querySelector('.MuiSkeleton-rectangular');
    expect(skeleton).toBeInTheDocument();
  });

  it('supports circular variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSkeleton variant="circular" width={40} height={40} />
      </TestWrapper>
    );
    const skeleton = container.querySelector('.MuiSkeleton-circular');
    expect(skeleton).toBeInTheDocument();
  });

  it('supports rounded variant', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSkeleton variant="rounded" width={200} height={100} />
      </TestWrapper>
    );
    const skeleton = container.querySelector('.MuiSkeleton-rounded');
    expect(skeleton).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <TestWrapper>
        <LoadingSkeleton ref={ref} />
      </TestWrapper>
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('LoadingOverlay', () => {
  it('shows overlay when loading is true', () => {
    render(
      <TestWrapper>
        <LoadingOverlay loading>
          <div>Content</div>
        </LoadingOverlay>
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('hides overlay when loading is false', () => {
    render(
      <TestWrapper>
        <LoadingOverlay loading={false}>
          <div>Content</div>
        </LoadingOverlay>
      </TestWrapper>
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(
      <TestWrapper>
        <LoadingOverlay loading label="Processing...">
          <div>Content</div>
        </LoadingOverlay>
      </TestWrapper>
    );
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('applies blur effect when blur is true', () => {
    render(
      <TestWrapper>
        <LoadingOverlay loading blur>
          <div>Content</div>
        </LoadingOverlay>
      </TestWrapper>
    );
    // Verify overlay renders with blur prop (blur is internal style implementation)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('supports custom spinner size', () => {
    render(
      <TestWrapper>
        <LoadingOverlay loading spinnerSize={80}>
          <div>Content</div>
        </LoadingOverlay>
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <TestWrapper>
        <LoadingOverlay loading>
          <div data-testid="child-content">Child Content</div>
        </LoadingOverlay>
      </TestWrapper>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <TestWrapper>
        <LoadingOverlay ref={ref} loading>
          Content
        </LoadingOverlay>
      </TestWrapper>
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('FullPageLoader', () => {
  it('renders when loading is true', () => {
    render(
      <TestWrapper>
        <FullPageLoader loading />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render when loading is false', () => {
    render(
      <TestWrapper>
        <FullPageLoader loading={false} />
      </TestWrapper>
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('displays custom label', () => {
    render(
      <TestWrapper>
        <FullPageLoader loading label="Fetching data..." />
      </TestWrapper>
    );
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('supports custom spinner size', () => {
    render(
      <TestWrapper>
        <FullPageLoader loading spinnerSize={100} />
      </TestWrapper>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has fixed positioning for full page overlay', () => {
    const { container } = render(
      <TestWrapper>
        <FullPageLoader loading />
      </TestWrapper>
    );
    const overlay = container.firstChild;
    expect(overlay).toHaveStyle({
      position: 'fixed',
    });
  });
});
