
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NebulaContextType {
  pulse: () => void;
  triggerPulseRef: React.MutableRefObject<(() => void) | null>;
}

const NebulaContext = createContext<NebulaContextType | undefined>(undefined);

export const useNebula = () => {
  const context = useContext(NebulaContext);
  if (!context) {
    throw new Error('useNebula must be used within a NebulaProvider');
  }
  return context;
};

export const NebulaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const triggerPulseRef = React.useRef<(() => void) | null>(null);

  const pulse = () => {
    if (triggerPulseRef.current) {
      triggerPulseRef.current();
    }
  };

  return (
    <NebulaContext.Provider value={{ pulse, triggerPulseRef }}>
      {children}
    </NebulaContext.Provider>
  );
};
