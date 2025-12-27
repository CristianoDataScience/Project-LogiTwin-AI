import { createContext, useContext, useState } from 'react';

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
    const [isSimulating, setIsSimulating] = useState(false);

    return (
        <SimulationContext.Provider value={{ isSimulating, setIsSimulating }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    return useContext(SimulationContext);
}
