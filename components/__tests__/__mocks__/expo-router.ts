import React from 'react';

module.exports = {
  Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
    React.createElement('View', props, children)
}; 