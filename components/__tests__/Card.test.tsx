import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../Card';
import { Text } from 'react-native';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const testMessage = 'Test Content';
    const { getByText } = render(
      <Card>
        <Text>{testMessage}</Text>
      </Card>
    );
    
    expect(getByText(testMessage)).toBeTruthy();
  });

  it('applies default classes', () => {
    const { getByTestId } = render(
      <Card testID="test-card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.className).toContain('rounded-card');
    expect(card.props.className).toContain('bg-dark-background-100');
    expect(card.props.className).toContain('px-layout');
    expect(card.props.className).toContain('py-9');
  });

  it('merges custom className with default classes', () => {
    const customClass = 'custom-class';
    const { getByTestId } = render(
      <Card testID="test-card" className={customClass}>
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.className).toContain(customClass);
    expect(card.props.className).toContain('rounded-card');
  });

  it('renders without className prop', () => {
    const { getByTestId } = render(
      <Card testID="test-card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = getByTestId('test-card');
    expect(card.props.className).toBeTruthy();
  });
}); 