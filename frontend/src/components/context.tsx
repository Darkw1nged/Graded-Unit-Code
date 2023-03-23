import { createContext, useState } from 'react';

type AppContextType = {
    isAdmin: boolean;
    toggleAdmin: () => void;
};

const AppContext = createContext<AppContextType>({
    isAdmin: false,
    toggleAdmin: () => {},
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleAdmin = () => {
        setIsAdmin(!isAdmin);
    };

    return (
        <AppContext.Provider value={{ isAdmin, toggleAdmin }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };