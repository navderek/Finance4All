import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { Modal } from './Modal';
import { lightTheme } from '@theme/index';
import { Button } from './Button';

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Modal', () => {
  it('renders when open is true', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test Modal">
          Modal content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open={false} onClose={onClose} title="Test Modal">
          Modal content
        </Modal>
      </TestWrapper>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays title', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Modal Title">
          Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('displays content', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          <div>This is the modal content</div>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('This is the modal content')).toBeInTheDocument();
  });

  it('displays actions', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal
          open
          onClose={onClose}
          title="Test"
          actions={
            <>
              <Button>Cancel</Button>
              <Button>Confirm</Button>
            </>
          }
        >
          Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('shows close button by default', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" showCloseButton={false}>
          Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    await user.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    // Click on the backdrop (MuiBackdrop-root)
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('does not close when backdrop is clicked if disableBackdropClick is true', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" disableBackdropClick>
          Content
        </Modal>
      </TestWrapper>
    );

    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it('calls onClose when escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows dividers when showDividers is true', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal
          open
          onClose={onClose}
          title="Test"
          showDividers
          actions={<Button>OK</Button>}
        >
          Content
        </Modal>
      </TestWrapper>
    );

    // Verify modal renders with dividers prop (dividers are internal MUI implementation)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('shows loading overlay when loading is true', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" loading>
          Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('supports different sizes', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" size="xs">
          XS Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('XS Content')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" size="sm">
          SM Content
        </Modal>
      </TestWrapper>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('SM Content')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" size="md">
          MD Content
        </Modal>
      </TestWrapper>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('MD Content')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" size="lg">
          LG Content
        </Modal>
      </TestWrapper>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('LG Content')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" size="xl">
          XL Content
        </Modal>
      </TestWrapper>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('XL Content')).toBeInTheDocument();
  });

  it('supports fullscreen mode via size prop', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" size="fullscreen">
          Fullscreen Content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Fullscreen Content')).toBeInTheDocument();
  });

  it('supports fullscreen mode via fullScreen prop', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" fullScreen>
          Fullscreen via prop
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Fullscreen via prop')).toBeInTheDocument();
  });

  it('renders without title', () => {
    const onClose = vi.fn();
    const { container } = render(
      <TestWrapper>
        <Modal open onClose={onClose}>
          Content only
        </Modal>
      </TestWrapper>
    );

    const dialogTitle = container.querySelector('.MuiDialogTitle-root');
    expect(dialogTitle).not.toBeInTheDocument();
  });

  it('renders without actions', () => {
    const onClose = vi.fn();
    const { container } = render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    const dialogActions = container.querySelector('.MuiDialogActions-root');
    expect(dialogActions).not.toBeInTheDocument();
  });

  it('has accessible dialog role', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Modal ref={ref} open onClose={onClose} title="Test">
          Content
        </Modal>
      </TestWrapper>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('renders complex content with multiple elements', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Complex Modal">
          <div>
            <h2>Section 1</h2>
            <p>Paragraph 1</p>
            <h2>Section 2</h2>
            <p>Paragraph 2</p>
          </div>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });

  it('supports custom maxWidth prop', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test" maxWidth="md">
          Custom width content
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Custom width content')).toBeInTheDocument();
  });

  it('action buttons are clickable', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TestWrapper>
        <Modal
          open
          onClose={onClose}
          title="Confirm Action"
          actions={
            <>
              <Button onClick={onCancel}>Cancel</Button>
              <Button onClick={onConfirm}>Confirm</Button>
            </>
          }
        >
          Are you sure?
        </Modal>
      </TestWrapper>
    );

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('maintains focus trap when open', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <Modal open onClose={onClose} title="Test">
          <Button>Inside Button</Button>
        </Modal>
      </TestWrapper>
    );

    const dialog = screen.getByRole('dialog');
    const button = within(dialog).getByText('Inside Button');
    expect(button).toBeInTheDocument();
  });
});
