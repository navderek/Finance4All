import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { Card } from './Card';
import { lightTheme } from '@theme/index';
import { Button } from './Button';
import Avatar from '@mui/material/Avatar';

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Card', () => {
  it('renders with children', () => {
    render(
      <TestWrapper>
        <Card>
          <div>Card content</div>
        </Card>
      </TestWrapper>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with different elevations', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <Card elevation={0}>No shadow</Card>
      </TestWrapper>
    );
    let card = container.querySelector('.MuiPaper-elevation0');
    expect(card).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Card elevation={4}>Medium shadow</Card>
      </TestWrapper>
    );
    card = container.querySelector('.MuiPaper-elevation4');
    expect(card).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Card elevation={8}>High shadow</Card>
      </TestWrapper>
    );
    card = container.querySelector('.MuiPaper-elevation8');
    expect(card).toBeInTheDocument();
  });

  it('supports hover elevation', () => {
    const { container } = render(
      <TestWrapper>
        <Card elevation="hover">Hover me</Card>
      </TestWrapper>
    );

    // Should start with elevation 1
    const card = container.querySelector('.MuiPaper-elevation1');
    expect(card).toBeInTheDocument();
  });

  it('renders as clickable with cursor pointer', () => {
    const { container } = render(
      <TestWrapper>
        <Card clickable>Clickable card</Card>
      </TestWrapper>
    );

    const card = container.querySelector('.MuiCard-root');
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('handles click events on clickable cards', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { container } = render(
      <TestWrapper>
        <Card clickable onClick={onClick}>
          Click me
        </Card>
      </TestWrapper>
    );

    const card = container.querySelector('.MuiCard-root');
    if (card) {
      await user.click(card);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });

  it('shows loading skeleton state', () => {
    const { container } = render(
      <TestWrapper>
        <Card loading>Loading content</Card>
      </TestWrapper>
    );

    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with header', () => {
    render(
      <TestWrapper>
        <Card
          header={{
            title: 'Card Title',
            subheader: 'Card Subheader',
          }}
        >
          Content
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subheader')).toBeInTheDocument();
  });

  it('renders header with avatar', () => {
    render(
      <TestWrapper>
        <Card
          header={{
            title: 'User Name',
            avatar: <Avatar data-testid="avatar">U</Avatar>,
          }}
        >
          Content
        </Card>
      </TestWrapper>
    );

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText('User Name')).toBeInTheDocument();
  });

  it('renders header with action', () => {
    render(
      <TestWrapper>
        <Card
          header={{
            title: 'Card Title',
            action: <Button data-testid="action-button">Edit</Button>,
          }}
        >
          Content
        </Card>
      </TestWrapper>
    );

    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  it('renders with media/image', () => {
    render(
      <TestWrapper>
        <Card media={{ image: '/test-image.jpg', alt: 'Test image', height: 300 }}>
          Content
        </Card>
      </TestWrapper>
    );

    const image = screen.getByRole('img', { name: 'Test image' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('height', '300');
  });

  it('renders with actions', () => {
    render(
      <TestWrapper>
        <Card
          actions={
            <>
              <Button>Share</Button>
              <Button>Learn More</Button>
            </>
          }
        >
          Content
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('supports different padding options', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <Card padding="none">No padding</Card>
      </TestWrapper>
    );
    let content = container.querySelector('.MuiCardContent-root');
    expect(content).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Card padding="small">Small padding</Card>
      </TestWrapper>
    );
    content = container.querySelector('.MuiCardContent-root');
    expect(content).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Card padding="large">Large padding</Card>
      </TestWrapper>
    );
    content = container.querySelector('.MuiCardContent-root');
    expect(content).toBeInTheDocument();
  });

  it('renders complete card with all sections', () => {
    render(
      <TestWrapper>
        <Card
          header={{
            title: 'Complete Card',
            subheader: 'With all sections',
            avatar: <Avatar>C</Avatar>,
          }}
          media={{
            image: '/image.jpg',
            alt: 'Card image',
          }}
          actions={
            <>
              <Button>Action 1</Button>
              <Button>Action 2</Button>
            </>
          }
        >
          This is the main content area
        </Card>
      </TestWrapper>
    );

    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('With all sections')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Card image' })).toBeInTheDocument();
    expect(screen.getByText('This is the main content area')).toBeInTheDocument();
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('shows loading skeleton with header', () => {
    const { container } = render(
      <TestWrapper>
        <Card
          loading
          header={{
            title: 'Loading Title',
          }}
        >
          Loading content
        </Card>
      </TestWrapper>
    );

    // Should show skeleton header
    const headerSkeletons = container.querySelectorAll('.MuiCardHeader-root .MuiSkeleton-root');
    expect(headerSkeletons.length).toBeGreaterThan(0);
  });

  it('shows loading skeleton with media', () => {
    const { container } = render(
      <TestWrapper>
        <Card
          loading
          media={{
            image: '/image.jpg',
            height: 250,
          }}
        >
          Loading content
        </Card>
      </TestWrapper>
    );

    const mediaSkeleton = container.querySelector('.MuiSkeleton-rectangular');
    expect(mediaSkeleton).toBeInTheDocument();
    expect(mediaSkeleton).toHaveAttribute('style', expect.stringContaining('height: 250px'));
  });

  it('shows loading skeleton with actions', () => {
    const { container } = render(
      <TestWrapper>
        <Card
          loading
          actions={
            <>
              <Button>Action</Button>
            </>
          }
        >
          Loading content
        </Card>
      </TestWrapper>
    );

    const actionSkeletons = container.querySelectorAll('.MuiCardActions-root .MuiSkeleton-root');
    expect(actionSkeletons.length).toBeGreaterThan(0);
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(
      <TestWrapper>
        <Card ref={ref}>With Ref</Card>
      </TestWrapper>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('does not render header when not provided', () => {
    const { container } = render(
      <TestWrapper>
        <Card>Content only</Card>
      </TestWrapper>
    );

    const header = container.querySelector('.MuiCardHeader-root');
    expect(header).not.toBeInTheDocument();
  });

  it('does not render media when not provided', () => {
    render(
      <TestWrapper>
        <Card>Content only</Card>
      </TestWrapper>
    );

    const media = screen.queryByRole('img');
    expect(media).not.toBeInTheDocument();
  });

  it('does not render actions when not provided', () => {
    const { container } = render(
      <TestWrapper>
        <Card>Content only</Card>
      </TestWrapper>
    );

    const actions = container.querySelector('.MuiCardActions-root');
    expect(actions).not.toBeInTheDocument();
  });

  it('uses default padding when not specified', () => {
    const { container } = render(
      <TestWrapper>
        <Card>Default padding</Card>
      </TestWrapper>
    );

    const content = container.querySelector('.MuiCardContent-root');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Default padding')).toBeInTheDocument();
  });

  it('uses default media height when not specified', () => {
    render(
      <TestWrapper>
        <Card media={{ image: '/image.jpg' }}>Content</Card>
      </TestWrapper>
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('height', '200');
  });
});
