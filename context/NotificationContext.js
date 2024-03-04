
import React, { createContext, useReducer, useContext } from 'react';

const NotificationContext = createContext();

const initialState = {
    refreshData: false,
    listeners: [],
};

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_LISTENER': {
            return {
                ...state,
                listeners: [...state.listeners, action.listener],
            };
        }
        case 'REMOVE_LISTENER': {
            return {
                ...state,
                listeners: state.listeners.filter((listener) => listener !== action.listener),
            };
        }
        case 'TOGGLE_REFRESH_DATA': {
            const newState = {
                ...state,
                refreshData: !state.refreshData,
            };

            // Notify all listeners when refreshData is toggled
            state.listeners.forEach((listener) => {
                listener(newState.refreshData);
            });

            return newState;
        }
        default:
            return state;
    }
};

export { NotificationContext, initialState, notificationReducer };



const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    return (
        <NotificationContext.Provider value={{ state, dispatch }}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export { NotificationProvider, useNotification };
