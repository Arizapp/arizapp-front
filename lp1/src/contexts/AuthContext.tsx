import { createContext, ReactNode, useEffect, useState } from "react";
import { userType as userTypeModel, SignIn as SignInModel, signInProps as signInPropsModel, singInFunctionReturnType as singInFunctionReturnTypeModel } from './../models/SignIn';
import { AuthUser as AuthUserModel, AuthUserAjaxCallResponse as AuthUserAjaxCallResponseModel } from './../models/AuthUser';

export type AuthContextProviderProps = {
    children?: ReactNode
};
export type AuthContextProviderType = {
    user: userTypeModel | undefined;
    setUser: (userData: userTypeModel) => void;
    authUser: () => Promise<AuthUserAjaxCallResponseModel>;
    singIn: (data: signInPropsModel) => Promise<singInFunctionReturnTypeModel | any>
};
export const AuthContext = createContext({} as AuthContextProviderType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<userTypeModel>();

    async function authUser(): Promise<AuthUserAjaxCallResponseModel> {
        const authResponse = await AuthUserModel();
        if (authResponse.success) {
            setUser({
                user_id: authResponse?.user_data?.id || 0,
                hostname: authResponse?.user_data?.host,
                username: authResponse?.user_data?.username,
                password: '',
                address: authResponse?.user_data?.endereco,
                location: { lat: authResponse?.user_data?.lat_lng[0], lng: authResponse?.user_data?.lat_lng[1] },
                description: authResponse?.user_data?.descricao,
                sing_up_status: authResponse?.user_data?.sing_up_status
            });
        }
        return authResponse;
    }

    async function singIn(data: signInPropsModel): Promise<singInFunctionReturnTypeModel> {
        var signInResponse = await SignInModel(data);
        if (signInResponse.success) {
            setUser(signInResponse.user);
        }
        return signInResponse;
    }
    useEffect(() => {
        console.log('Use effect trigged');
        if (!user) {
            authUser();
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, setUser, authUser, singIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}
