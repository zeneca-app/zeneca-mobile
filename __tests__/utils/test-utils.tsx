import React from "react";
import { render as rtlRender } from "@testing-library/react-native";

// Custom render function that includes providers
function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { render }; 