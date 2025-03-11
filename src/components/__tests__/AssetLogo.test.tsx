import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AssetLogo } from '@/components/AssetLogo';
import { STOCKS } from '@/constants/stocks';
import { Text, View } from 'react-native';

// Mock the STOCKS constant
jest.mock('@/constants/stocks', () => ({
  STOCKS: {
    AAPL: {
      logo: () => <View testID="mock-stock-logo" />
    }
  }
}));

describe('AssetLogo', () => {
  describe('Logo Source Selection', () => {
    it('renders stock logo when available', () => {
      render(<AssetLogo symbol="AAPL" />);
      expect(screen.getByTestId('mock-stock-logo')).toBeTruthy();
    });

    it('renders custom fallback when provided', () => {
      const CustomFallback = () => <Text>Custom</Text>;
      render(
        <AssetLogo 
          symbol="INVALID" 
          fallbackComponent={<CustomFallback />} 
        />
      );
      expect(screen.getByText('Custom')).toBeTruthy();
    });

    it('renders URL-based logo when provided', () => {
      const { UNSAFE_getByType } = render(
        <AssetLogo 
          symbol="BTC" 
          logoUrl="https://example.com/btc.png" 
        />
      );
      const image = UNSAFE_getByType('Image');
      expect(image.props.source.uri).toBe('https://example.com/btc.png');
    });

    it('renders default fallback as last resort', () => {
      render(<AssetLogo symbol="TEST" />);
      expect(screen.getByText('T')).toBeTruthy();
    });

    it('renders question mark for undefined symbol', () => {
      render(<AssetLogo />);
      expect(screen.getByText('?')).toBeTruthy();
    });
  });

  describe('Sizing', () => {
    it('applies correct size classes for each variant', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      sizes.forEach(size => {
        const { container } = render(<AssetLogo symbol="TEST" size={size} />);
        const view = container.firstChild;
        expect(view.props.className).toContain(
          size === 'sm' ? 'w-6 h-6' :
          size === 'md' ? 'w-12 h-12' : 'w-16 h-16'
        );
      });
    });

    it('applies correct font sizes for fallback text', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      sizes.forEach(size => {
        render(<AssetLogo symbol="TEST" size={size} />);
        const text = screen.getByText('T');
        expect(text.props.className).toContain(
          size === 'sm' ? 'text-sm' :
          size === 'md' ? 'text-lg' : 'text-xl'
        );
      });
    });
  });

  describe('Styling', () => {
    it('applies custom className correctly', () => {
      const { container } = render(
        <AssetLogo symbol="TEST" className="custom-class" />
      );
      const view = container.firstChild;
      expect(view.props.className).toContain('custom-class');
    });

    it('applies custom background color', () => {
      const { container } = render(
        <AssetLogo symbol="TEST" bgColorClass="bg-blue-500" />
      );
      const view = container.firstChild;
      expect(view.props.className).toContain('bg-blue-500');
    });

    it('applies custom styles', () => {
      const customStyle = { opacity: 0.5 };
      const { container } = render(
        <AssetLogo symbol="TEST" style={customStyle} />
      );
      const view = container.firstChild;
      expect(view.props.style).toMatchObject(customStyle);
    });
  });

  describe('Error Handling', () => {
    const originalConsoleWarn = console.warn;
    beforeEach(() => {
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.warn = originalConsoleWarn;
    });

    it('handles missing symbol gracefully', () => {
      render(<AssetLogo />);
      expect(screen.getByText('?')).toBeTruthy();
    });

    it('handles failed image loads', () => {
      const { UNSAFE_getByType } = render(
        <AssetLogo 
          symbol="BTC" 
          logoUrl="https://example.com/invalid.png" 
        />
      );
      const image = UNSAFE_getByType('Image');
      image.props.onError({ error: new Error('Failed to load') });
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to load image for BTC:',
        expect.any(Object)
      );
    });
  });
}); 