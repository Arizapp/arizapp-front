import { useContext } from "react";
import { AuthContext, AuthUserTypeContext } from "../contexts/AuthContext";


export function useAuth(): AuthUserTypeContext {
    const value = useContext(AuthContext);
    return value;
}