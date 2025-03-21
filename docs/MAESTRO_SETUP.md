# Maestro E2E Testing Setup Guide

## 1. Installation

### Install Maestro CLI
```bash
# For macOS using Homebrew
brew tap mobile-dev-inc/tap
brew install maestro

# Verify installation
maestro --version
```

## 2. Project Configuration

### 2.1 Create Maestro Directory Structure
```bash
mkdir -p .maestro/flows
mkdir -p .maestro/screenshots
```

### 2.2 Add Maestro Scripts to package.json
Add these scripts to your package.json:
```json
{
  "scripts": {
    "test:e2e": "maestro test .maestro/flows",
    "test:e2e:record": "maestro record",
    "test:e2e:studio": "maestro studio"
  }
}
```

## 3. Sample Test Flows

### 3.1 Authentication Flow
Create `.maestro/flows/auth.yaml`:
```yaml
appId: com.zeneca.mobile
---
- launchApp
- assertVisible: "Sign In"
- tapOn: "Sign In"
- assertVisible: "Email"
- inputText: "test@example.com"
  into: "Email"
- assertVisible: "Password"
- inputText: "password123"
  into: "Password"
- tapOn: "Sign In"
- waitForAnimationToEnd
- assertVisible: "Dashboard"
```

### 3.2 Navigation Flow
Create `.maestro/flows/navigation.yaml`:
```yaml
appId: com.zeneca.mobile
---
- launchApp
- assertVisible: "Dashboard"
- tapOn: "Profile"
- assertVisible: "Profile Settings"
- tapOn: "Wallet"
- assertVisible: "Wallet Balance"
- tapOn: "Back"
- assertVisible: "Profile Settings"
```

### 3.3 Web3 Transaction Flow
Create `.maestro/flows/transaction.yaml`:
```yaml
appId: com.zeneca.mobile
---
- launchApp
- tapOn: "Wallet"
- assertVisible: "Send"
- tapOn: "Send"
- assertVisible: "Amount"
- inputText: "0.1"
  into: "Amount"
- assertVisible: "Address"
- inputText: "0x1234...5678"
  into: "Address"
- tapOn: "Review Transaction"
- assertVisible: "Confirm"
- tapOn: "Confirm"
- waitForAnimationToEnd
- assertVisible: "Transaction Submitted"
```

## 4. CI/CD Integration

### 4.1 GitHub Actions Setup
Create `.github/workflows/e2e-tests.yml`:
```yaml
name: E2E Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: yarn install
        
      - name: Install Maestro
        run: |
          brew tap mobile-dev-inc/tap
          brew install maestro
          
      - name: Build iOS app
        run: yarn ios
        
      - name: Run Maestro tests
        run: yarn test:e2e
```

## 5. Best Practices

### 5.1 Test Organization
- Group related tests in separate flow files
- Use descriptive names for test files and steps
- Add comments for complex interactions
- Include assertions after each important action

### 5.2 Stable Selectors
Prefer using these selectors in order:
1. Test IDs
2. Text content
3. Class names (as last resort)

### 5.3 Handling Async Operations
- Use `waitForAnimationToEnd` after transitions
- Add appropriate waits for network requests
- Include timeout configurations for slow operations

### 5.4 Screenshots
```yaml
# Add to your flows to capture screenshots
- takeScreenshot: "screen-name"
```

## 6. Common Commands

```bash
# Run all tests
yarn test:e2e

# Record a new test flow
yarn test:e2e:record

# Open Maestro Studio
yarn test:e2e:studio

# Run specific flow
maestro test .maestro/flows/auth.yaml

# Run with debugging
maestro test -c .maestro/flows/auth.yaml
```

## 7. Troubleshooting

### Common Issues and Solutions

1. **App Not Found**
   - Verify the correct `appId` in flow files
   - Ensure app is installed on the device/simulator

2. **Element Not Found**
   - Check if the element is visible on screen
   - Verify selectors (test IDs, text)
   - Add appropriate waits

3. **Test Flakiness**
   - Add proper waits for animations
   - Include assertions between steps
   - Use stable selectors

4. **CI/CD Issues**
   - Verify simulator/device setup
   - Check environment variables
   - Enable verbose logging for debugging

## 8. Additional Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/commands)
- [Maestro Flow Syntax](https://maestro.mobile.dev/flows/syntax)
- [CI/CD Integration Guide](https://maestro.mobile.dev/ci-cd) 