import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp, useSSO } from '@clerk/clerk-expo';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUp from '../../app/signup';

// Mock modules
jest.mock('@/components/LoggedLayout', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSafeAreaInsets: () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }),
}));

jest.mock('@clerk/clerk-expo/local-credentials', () => ({
    useLocalCredentials: () => ({
        hasCredentials: false,
        setCredentials: jest.fn(),
        authenticate: jest.fn(),
        biometricType: null,
    }),
}));

const mockRouter = {
    push: jest.fn(),
};

const mockStartSSOFlow = jest.fn();
const mockT = jest.fn((key) => key);

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
}));

jest.mock('@clerk/clerk-expo', () => ({
    useSignUp: jest.fn(() => ({
        isLoaded: true,
    })),
    useSSO: jest.fn(() => ({
        startSSOFlow: mockStartSSOFlow,
    })),
    isClerkAPIResponseError: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: mockT,
    }),
}));

describe('SignUp Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Component Rendering', () => {
        it('should render all UI elements correctly', () => {
            const { getByTestId } = render(<SignUp />);

            expect(getByTestId('signup-title')).toBeTruthy();
            expect(getByTestId('email-signup-button')).toBeTruthy();
            expect(getByTestId('google-signup-button')).toBeTruthy();
            expect(getByTestId('terms-text')).toBeTruthy();
        });

        it('should render buttons in enabled state when isLoaded is true', () => {
            const { getByTestId } = render(<SignUp />);

            const emailButton = getByTestId('email-signup-button');
            const googleButton = getByTestId('google-signup-button');

            expect(emailButton.props.accessibilityState.disabled).toBeFalsy();
            expect(googleButton.props.accessibilityState.disabled).toBeFalsy();
        });

        it('should render buttons in disabled state when isLoaded is false', () => {
            (useSignUp as jest.Mock).mockImplementationOnce(() => ({
                isLoaded: false,
            }));

            const { getByTestId } = render(<SignUp />);

            const emailButton = getByTestId('email-signup-button');
            const googleButton = getByTestId('google-signup-button');

            expect(emailButton.props.accessibilityState.disabled).toBeTruthy();
            expect(googleButton.props.accessibilityState.disabled).toBeTruthy();
        });
    });

    describe('Email Sign Up Flow', () => {
        it('should navigate to email signup screen when email button is pressed', async () => {
            const { getByTestId } = render(<SignUp />);
            
            const emailButton = getByTestId('email-signup-button');
            await act(async () => {
                fireEvent.press(emailButton);
            });
            
            expect(mockRouter.push).toHaveBeenCalledWith('/email-signup');
        });

        it('should show loading state during email signup process', async () => {
            const { getByTestId } = render(<SignUp />);
            
            const emailButton = getByTestId('email-signup-button');
            await act(async () => {
                fireEvent.press(emailButton);
            });
            
            expect(emailButton.props.accessibilityState.disabled).toBeTruthy();
        });
    });

    describe('Google Sign Up Flow', () => {
        it('should initiate Google OAuth flow when Google button is pressed', async () => {
            const mockSessionId = 'test-session-id';
            const mockSetActive = jest.fn();
            
            mockStartSSOFlow.mockResolvedValueOnce({
                createdSessionId: mockSessionId,
                setActive: mockSetActive,
            });

            const { getByTestId } = render(<SignUp />);
            
            const googleButton = getByTestId('google-signup-button');
            await act(async () => {
                fireEvent.press(googleButton);
            });
            
            expect(mockStartSSOFlow).toHaveBeenCalledWith({
                strategy: 'oauth_google',
                redirectUrl: 'mock-redirect-uri',
            });

            expect(mockSetActive).toHaveBeenCalledWith({
                session: mockSessionId,
            });
        });

        it('should show error alert when Google sign up fails', async () => {
            const mockError = new Error('Google sign up failed');
            mockStartSSOFlow.mockRejectedValueOnce(mockError);

            const { getByTestId } = render(<SignUp />);
            
            const googleButton = getByTestId('google-signup-button');
            await act(async () => {
                fireEvent.press(googleButton);
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Google sign up failed'
            );
        });

        it('should show loading state during Google sign up process', async () => {
            mockStartSSOFlow.mockImplementationOnce(() => new Promise(() => {}));

            const { getByTestId } = render(<SignUp />);

            const googleButton = getByTestId('google-signup-button');
            await act(async () => {
                fireEvent.press(googleButton);
            });

            expect(googleButton.props.accessibilityState.disabled).toBeTruthy();
        });
    });
}); 