import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardBackground } from './CardBackground';

describe('CardBackground', () => {
  it('renders children with default variant', () => {
    render(
      <CardBackground>
        <div>Test content</div>
      </CardBackground>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <CardBackground className="w-64 h-64">
        <div>Content</div>
      </CardBackground>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('w-64', 'h-64');
  });

  it('applies correct gradient for sms variant', () => {
    const { container } = render(
      <CardBackground variant="sms">
        <div>SMS Content</div>
      </CardBackground>
    );

    const gradientLayer = container.querySelector('.bg-gradient-to-br');
    expect(gradientLayer).toHaveClass('from-pink-50', 'via-pink-100', 'to-white');
  });

  it('applies correct gradient for wallet variant', () => {
    const { container } = render(
      <CardBackground variant="wallet">
        <div>Wallet Content</div>
      </CardBackground>
    );

    const gradientLayer = container.querySelector('.bg-gradient-to-br');
    expect(gradientLayer).toHaveClass('from-yellow-50', 'via-orange-50', 'to-yellow-100');
  });

  it('applies correct gradient for phone variant', () => {
    const { container } = render(
      <CardBackground variant="phone">
        <div>Phone Content</div>
      </CardBackground>
    );

    const gradientLayer = container.querySelector('.bg-gradient-to-br');
    expect(gradientLayer).toHaveClass('from-gray-200', 'via-gray-100', 'to-gray-300');
  });

  it('applies correct gradient for camcorder variant', () => {
    const { container } = render(
      <CardBackground variant="camcorder">
        <div>Camcorder Content</div>
      </CardBackground>
    );

    const gradientLayer = container.querySelector('.bg-gradient-to-br');
    expect(gradientLayer).toHaveClass('from-purple-50', 'via-indigo-50', 'to-blue-50');
  });

  it('applies correct gradient for cake variant', () => {
    const { container } = render(
      <CardBackground variant="cake">
        <div>Cake Content</div>
      </CardBackground>
    );

    const gradientLayer = container.querySelector('.bg-gradient-to-br');
    expect(gradientLayer).toHaveClass('from-orange-50', 'via-red-50', 'to-pink-50');
  });

  it('applies correct gradient for default variant', () => {
    const { container } = render(
      <CardBackground variant="default">
        <div>Default Content</div>
      </CardBackground>
    );

    const gradientLayer = container.querySelector('.bg-gradient-to-br');
    expect(gradientLayer).toHaveClass('from-white', 'via-gray-50', 'to-gray-100');
  });

  it('applies border and shadow classes', () => {
    const { container } = render(
      <CardBackground>
        <div>Content</div>
      </CardBackground>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('border-[4px]', 'border-deep-black', 'sticker-shadow-hard');
  });

  it('includes paper texture overlay with aria-hidden', () => {
    const { container } = render(
      <CardBackground>
        <div>Content</div>
      </CardBackground>
    );

    const textureOverlay = container.querySelector('[style*="paper-grain"]');
    expect(textureOverlay).toBeInTheDocument();
    expect(textureOverlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders children above background layers', () => {
    const { container } = render(
      <CardBackground>
        <div data-testid="content">Test content</div>
      </CardBackground>
    );

    const content = container.querySelector('[data-testid="content"]');
    const parent = content?.parentElement;
    expect(parent).toHaveClass('relative', 'z-10');
  });
});
