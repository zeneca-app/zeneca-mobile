import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';
import { Text } from 'react-native';

jest.mock('expo-router');
jest.mock('nativewind');

describe('Button Component', () => {
  it('renders children correctly', () => {
    const testMessage = 'Click Me';
    const { getByText } = render(
      <Button>
        <Text>{testMessage}</Text>
      </Button>
    );
    
    expect(getByText(testMessage)).toBeTruthy();
  });

  it('handles onPress events when enabled', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button testID="test-button" onPress={onPressMock}>
        <Text>Click Me</Text>
      </Button>
    );
    
    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('does not trigger onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button testID="test-button" onPress={onPressMock} disabled>
        <Text>Click Me</Text>
      </Button>
    );
    
    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator when isLoading is true', () => {
    const { getByTestId } = render(
      <Button testID="test-button" isLoading>
        <Text>Click Me</Text>
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('applies solid variant styles by default', () => {
    const { getByTestId } = render(
      <Button testID="test-button">
        <Text>Click Me</Text>
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button.props.className).toContain('bg-white');
  });

  it('applies outline variant styles', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="outline">
        <Text>Click Me</Text>
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button.props.className).toContain('border-white');
  });

  it('applies link variant styles', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="link">
        <Text>Click Me</Text>
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button.props.className).toContain('text-white');
  });

  it('renders as Link component when href is provided', () => {
    const { getByTestId } = render(
      <Button testID="test-button" href="/some-path">
        <Text>Click Me</Text>
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('merges custom className with variant classes', () => {
    const customClass = 'custom-class';
    const { getByTestId } = render(
      <Button testID="test-button" className={customClass}>
        <Text>Click Me</Text>
      </Button>
    );
    
    const button = getByTestId('test-button');
    expect(button.props.className).toContain(customClass);
    expect(button.props.className).toContain('bg-white');
  });
}); 