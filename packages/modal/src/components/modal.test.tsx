import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Modal, ConfirmModal } from './modal';

describe('Modal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should not render when open is false', () => {
      render(
        <Modal open={false} onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should render when open is true', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <div>Modal Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(
        <Modal open={true} onClose={() => {}} title="Test Title">
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <p data-testid="content">Custom Content</p>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose} title="Test">
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      // Click directly on the backdrop (dialog's parent which is the portal container)
      const dialog = screen.getByRole('dialog');
      // The backdrop is the parent div with the onClick handler
      fireEvent.click(dialog);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClose when clicking inside modal', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose}>
          <div data-testid="inner">Inner Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      fireEvent.click(screen.getByTestId('inner'));

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose on Escape key press', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should NOT close on Escape when closeOnEscape is false', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose} closeOnEscape={false}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should NOT close on backdrop click when closeOnBackdropClick is false', () => {
      const onClose = vi.fn();
      render(
        <Modal open={true} onClose={onClose} closeOnBackdropClick={false}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      const backdrop = screen.getByRole('dialog').parentElement;
      fireEvent.click(backdrop!);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Footer', () => {
    it('should render footer when provided', () => {
      render(
        <Modal open={true} onClose={() => {}} footer={<button data-testid="footer-btn">Action</button>}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByTestId('footer-btn')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-modal attribute', () => {
      render(
        <Modal open={true} onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should link title with aria-labelledby', () => {
      render(
        <Modal open={true} onClose={() => {}} title="Test Title">
          <div>Content</div>
        </Modal>
      );

      act(() => {
        vi.runAllTimers();
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });
  });

  describe('Sizes', () => {
    it('should render different sizes', () => {
      const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
      
      for (const size of sizes) {
        const { unmount } = render(
          <Modal open={true} onClose={() => {}} size={size}>
            <div>Content</div>
          </Modal>
        );
        
        act(() => {
          vi.runAllTimers();
        });
        
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        unmount();
      }
    });
  });
});

describe('ConfirmModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render with default props', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Are you sure?"
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    // Default title is 'Confirm'
    expect(screen.getAllByRole('button', { name: 'Confirm' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        message="Confirm?"
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    // Find the confirm button (not the title)
    const buttons = screen.getAllByRole('button');
    const confirmBtn = buttons.find(btn => btn.textContent === 'Confirm');
    fireEvent.click(confirmBtn!);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onClose={onClose}
        onConfirm={() => {}}
        message="Cancel?"
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when loading', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Loading?"
        loading={true}
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    // When loading, buttons show "Loading..." and "Cancel"
    const loadingBtn = screen.getByRole('button', { name: 'Loading...' });
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });

    expect(loadingBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });

  it('should use custom confirm and cancel text', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Custom text"
        confirmText="Yes, proceed"
        cancelText="No, go back"
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole('button', { name: 'Yes, proceed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No, go back' })).toBeInTheDocument();
  });

  it('should render with title from props', () => {
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Message"
        title="Custom Title"
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
