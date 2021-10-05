import { useContext } from "react";//
// import { useHistory } from "react-router";
import { AuthContext, AuthContextProviderType } from "../contexts/AuthContext";


export function useAuth(): AuthContextProviderType {

    //Provide an var to set if will push user to login page if not auth
    //var userHistory = useHistory();
    const value = useContext(AuthContext);
    return value;
}