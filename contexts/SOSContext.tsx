import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SOSContextType {
    isSosActive: boolean;
    triggerSOS: () => void;
    closeSOS: () => void;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

export const SOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSosActive, setIsSosActive] = useState(false);

    const triggerSOS = () => setIsSosActive(true);
    const closeSOS = () => setIsSosActive(false);

    return (
        <SOSContext.Provider value={{ isSosActive, triggerSOS, closeSOS }}>
            {children}
        </SOSContext.Provider>
    );
};

export const useSOS = () => {
    const context = useContext(SOSContext);
    if (context === undefined) {
        throw new Error('useSOS must be used within a SOSProvider');
    }
    return context;
};
