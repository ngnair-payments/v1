import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  SetStateAction,
} from "react";

const AuthContext = createContext<Record<string, any>>({});

const AuthProvider = ({ children }: any) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Function to set the authentication token
  const setToken = (newToken: SetStateAction<string | null>) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      (async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URI}/auth/validateToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(async (ok) => ok.text());
        if (response !== "ok") {
          setToken(null);
        }
      })();

      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
