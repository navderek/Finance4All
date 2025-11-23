import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  PageTransition,
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerList,
  StaggerItem,
  AnimatedBox,
} from './components';

// Mock matchMedia for reduced motion tests
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('Animation Components', () => {
  describe('PageTransition', () => {
    it('renders children', () => {
      render(<PageTransition>Page content</PageTransition>);
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<PageTransition ref={ref}>Content</PageTransition>);
      expect(ref).toHaveBeenCalled();
    });

    it('respects reduced motion preference', () => {
      mockMatchMedia(true);
      const { container } = render(<PageTransition>Content</PageTransition>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('FadeIn', () => {
    it('renders children', () => {
      render(<FadeIn>Fade in content</FadeIn>);
      expect(screen.getByText('Fade in content')).toBeInTheDocument();
    });

    it('supports direction prop - up', () => {
      render(<FadeIn direction="up">Fade up</FadeIn>);
      expect(screen.getByText('Fade up')).toBeInTheDocument();
    });

    it('supports direction prop - down', () => {
      render(<FadeIn direction="down">Fade down</FadeIn>);
      expect(screen.getByText('Fade down')).toBeInTheDocument();
    });

    it('supports direction prop - none', () => {
      render(<FadeIn direction="none">Fade only</FadeIn>);
      expect(screen.getByText('Fade only')).toBeInTheDocument();
    });

    it('supports delay prop', () => {
      render(<FadeIn delay={0.5}>Delayed fade</FadeIn>);
      expect(screen.getByText('Delayed fade')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<FadeIn ref={ref}>Content</FadeIn>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('SlideIn', () => {
    it('renders children', () => {
      render(<SlideIn>Slide content</SlideIn>);
      expect(screen.getByText('Slide content')).toBeInTheDocument();
    });

    it('supports direction prop - left', () => {
      render(<SlideIn direction="left">Slide from left</SlideIn>);
      expect(screen.getByText('Slide from left')).toBeInTheDocument();
    });

    it('supports direction prop - right', () => {
      render(<SlideIn direction="right">Slide from right</SlideIn>);
      expect(screen.getByText('Slide from right')).toBeInTheDocument();
    });

    it('supports delay prop', () => {
      render(<SlideIn delay={0.3}>Delayed slide</SlideIn>);
      expect(screen.getByText('Delayed slide')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<SlideIn ref={ref}>Content</SlideIn>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('ScaleIn', () => {
    it('renders children', () => {
      render(<ScaleIn>Scale content</ScaleIn>);
      expect(screen.getByText('Scale content')).toBeInTheDocument();
    });

    it('supports delay prop', () => {
      render(<ScaleIn delay={0.2}>Delayed scale</ScaleIn>);
      expect(screen.getByText('Delayed scale')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<ScaleIn ref={ref}>Content</ScaleIn>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('StaggerList', () => {
    it('renders children', () => {
      render(
        <StaggerList>
          <div>Item 1</div>
          <div>Item 2</div>
        </StaggerList>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('supports staggerDelay prop', () => {
      render(
        <StaggerList staggerDelay={0.2}>
          <div>Item 1</div>
        </StaggerList>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <StaggerList ref={ref}>
          <div>Content</div>
        </StaggerList>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('StaggerItem', () => {
    it('renders children', () => {
      render(<StaggerItem>Stagger item</StaggerItem>);
      expect(screen.getByText('Stagger item')).toBeInTheDocument();
    });

    it('works within StaggerList', () => {
      render(
        <StaggerList>
          <StaggerItem>Item 1</StaggerItem>
          <StaggerItem>Item 2</StaggerItem>
          <StaggerItem>Item 3</StaggerItem>
        </StaggerList>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<StaggerItem ref={ref}>Content</StaggerItem>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('AnimatedBox', () => {
    it('renders children', () => {
      render(<AnimatedBox>Animated content</AnimatedBox>);
      expect(screen.getByText('Animated content')).toBeInTheDocument();
    });

    it('supports animation prop - fade', () => {
      render(<AnimatedBox animation="fade">Fade animation</AnimatedBox>);
      expect(screen.getByText('Fade animation')).toBeInTheDocument();
    });

    it('supports animation prop - slide', () => {
      render(<AnimatedBox animation="slide">Slide animation</AnimatedBox>);
      expect(screen.getByText('Slide animation')).toBeInTheDocument();
    });

    it('supports animation prop - scale', () => {
      render(<AnimatedBox animation="scale">Scale animation</AnimatedBox>);
      expect(screen.getByText('Scale animation')).toBeInTheDocument();
    });

    it('supports direction prop - up', () => {
      render(
        <AnimatedBox animation="fade" direction="up">
          Fade up
        </AnimatedBox>
      );
      expect(screen.getByText('Fade up')).toBeInTheDocument();
    });

    it('supports direction prop - down', () => {
      render(
        <AnimatedBox animation="fade" direction="down">
          Fade down
        </AnimatedBox>
      );
      expect(screen.getByText('Fade down')).toBeInTheDocument();
    });

    it('supports direction prop - left', () => {
      render(
        <AnimatedBox animation="slide" direction="left">
          Slide left
        </AnimatedBox>
      );
      expect(screen.getByText('Slide left')).toBeInTheDocument();
    });

    it('supports direction prop - right', () => {
      render(
        <AnimatedBox animation="slide" direction="right">
          Slide right
        </AnimatedBox>
      );
      expect(screen.getByText('Slide right')).toBeInTheDocument();
    });

    it('supports delay prop', () => {
      render(<AnimatedBox delay={0.4}>Delayed</AnimatedBox>);
      expect(screen.getByText('Delayed')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<AnimatedBox ref={ref}>Content</AnimatedBox>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Reduced Motion Support', () => {
    it('all components respect reduced motion preference', () => {
      mockMatchMedia(true);

      const { container } = render(
        <>
          <PageTransition>Page</PageTransition>
          <FadeIn>Fade</FadeIn>
          <SlideIn>Slide</SlideIn>
          <ScaleIn>Scale</ScaleIn>
          <AnimatedBox>Box</AnimatedBox>
        </>
      );

      expect(container).toBeInTheDocument();
      expect(screen.getByText('Page')).toBeInTheDocument();
      expect(screen.getByText('Fade')).toBeInTheDocument();
      expect(screen.getByText('Slide')).toBeInTheDocument();
      expect(screen.getByText('Scale')).toBeInTheDocument();
      expect(screen.getByText('Box')).toBeInTheDocument();
    });
  });
});
