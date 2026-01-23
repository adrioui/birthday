import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FloatingChromeText } from './FloatingChromeText';

describe('FloatingChromeText', () => {
  it('renders text with default props', () => {
    render(<FloatingChromeText text="A" position={{ top: '10%', left: '10%' }} />);

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('applies chrome-text class', () => {
    const { container } = render(
      <FloatingChromeText text="B" position={{ top: '20%', right: '20%' }} />
    );

    const textElement = container.querySelector('h1');
    expect(textElement).toHaveClass('chrome-text');
  });

  it('applies default size text-8xl', () => {
    const { container } = render(
      <FloatingChromeText text="C" position={{ bottom: '30%', left: '30%' }} />
    );

    const textElement = container.querySelector('h1');
    expect(textElement).toHaveClass('text-8xl');
  });

  it('applies custom size', () => {
    const { container } = render(
      <FloatingChromeText text="D" position={{ top: '40%', right: '40%' }} size="text-6xl" />
    );

    const textElement = container.querySelector('h1');
    expect(textElement).toHaveClass('text-6xl');
  });

  it('applies rotation', () => {
    const { container } = render(
      <FloatingChromeText text="E" position={{ bottom: '50%', left: '50%' }} rotation={-12} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transform).toBe('rotate(-12deg)');
  });

  it('applies default rotation of 0', () => {
    const { container } = render(
      <FloatingChromeText text="F" position={{ top: '60%', right: '60%' }} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transform).toBe('rotate(0deg)');
  });

  it('applies custom position', () => {
    const { container } = render(
      <FloatingChromeText
        text="G"
        position={{ top: '10%', right: '10%', bottom: '10%', left: '10%' }}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.top).toBe('10%');
    expect(wrapper.style.right).toBe('10%');
    expect(wrapper.style.bottom).toBe('10%');
    expect(wrapper.style.left).toBe('10%');
  });

  it('renders without plate by default', () => {
    const { container } = render(
      <FloatingChromeText text="H" position={{ top: '70%', left: '70%' }} />
    );

    const plate = container.querySelector('.text-bg-plate');
    expect(plate).not.toBeInTheDocument();
  });

  it('renders with plate when showPlate is true', () => {
    const { container } = render(
      <FloatingChromeText text="I" position={{ top: '80%', right: '80%' }} showPlate={true} />
    );

    const plate = container.querySelector('.text-bg-plate');
    expect(plate).toBeInTheDocument();
  });

  it('plate has rounded-xl and padding', () => {
    const { container } = render(
      <FloatingChromeText text="J" position={{ bottom: '90%', left: '90%' }} showPlate={true} />
    );

    const plate = container.querySelector('.text-bg-plate');
    expect(plate).toHaveClass('rounded-xl', 'px-4', 'py-2');
  });

  it('sets pointer-events-none', () => {
    const { container } = render(
      <FloatingChromeText text="K" position={{ top: '5%', left: '5%' }} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('pointer-events-none');
  });

  it('sets select-none', () => {
    const { container } = render(
      <FloatingChromeText text="L" position={{ top: '15%', right: '15%' }} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('select-none');
  });

  it('sets absolute positioning', () => {
    const { container } = render(
      <FloatingChromeText text="M" position={{ bottom: '25%', left: '25%' }} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('absolute');
  });

  it('sets aria-hidden for accessibility', () => {
    const { container } = render(
      <FloatingChromeText text="N" position={{ top: '35%', right: '35%' }} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });
});
