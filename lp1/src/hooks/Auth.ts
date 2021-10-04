import { useContext } from "react";
import { AuthContext, AuthContextProviderType } from "../contexts/AuthContext";


export function useAuth(): AuthContextProviderType {
    const value = useContext(AuthContext);
    return value;
}