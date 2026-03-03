import React, { createContext, useReducer } from 'react';

const initialState = {
    selectedCategory: 'all',
    layers: { incidents: true, resources: true },
    userLocation: null
};

export const MapContext = createContext(initialState);

export const MapProvider = ({ children }) => {
    // TODO: Implement reducer for state transitions
    const [state, dispatch] = useReducer((s, a) => s, initialState);

    return (
        <MapContext.Provider value={{ state, dispatch }}>
            {children}
        </MapContext.Provider>
    );
};