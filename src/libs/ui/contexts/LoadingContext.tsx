import { createContext, useContext, useState, useCallback, type FC, type ReactNode } from "react";

type LoadingState = {
    [key: string]: boolean;
};

type LoadingContextType = {
    loadingStates: LoadingState;
    setLoading: (key: string, isLoading: boolean) => void;
    isLoading: (key: string) => boolean;
    setGlobalLoading: (isLoading: boolean) => void;
    isGlobalLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

type LoadingProviderProps = {
    children: ReactNode;
};

export const LoadingProvider: FC<LoadingProviderProps> = ({ children }) => {
    const [loadingStates, setLoadingStates] = useState<LoadingState>({});
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);

    const setLoading = useCallback((key: string, isLoading: boolean) => {
        setLoadingStates((prev) => ({
            ...prev,
            [key]: isLoading,
        }));
    }, []);

    const isLoading = useCallback(
        (key: string) => {
            return isGlobalLoading || loadingStates[key] || false;
        },
        [loadingStates, isGlobalLoading]
    );

    const setGlobalLoading = useCallback((isLoading: boolean) => {
        setIsGlobalLoading(isLoading);
    }, []);

    return (
        <LoadingContext.Provider
            value={{
                loadingStates,
                setLoading,
                isLoading,
                setGlobalLoading,
                isGlobalLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = (componentKey?: string) => {
    const context = useContext(LoadingContext);

    // If context is not available, return a fallback implementation
    if (context === undefined) {
        return {
            isLoading: false,
            setLoading: () => {},
            setGlobalLoading: () => {},
            isGlobalLoading: false,
            setComponentLoading: () => {},
            isComponentLoading: () => false,
        };
    }

    const { setLoading, isLoading, setGlobalLoading, isGlobalLoading } = context;

    return {
        isLoading: componentKey ? isLoading(componentKey) : isGlobalLoading,
        setLoading: componentKey
            ? (loading: boolean) => setLoading(componentKey, loading)
            : setGlobalLoading,
        setGlobalLoading,
        isGlobalLoading,
        setComponentLoading: (key: string, loading: boolean) => setLoading(key, loading),
        isComponentLoading: (key: string) => isLoading(key),
    };
};
