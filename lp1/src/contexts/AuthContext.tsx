import { createContext, ReactNode, useState, useEffect } from "react";
import { userType as userTypeModel, SignIn as SignInModel, signInProps as signInPropsModel, singInFunctionReturnType as singInFunctionReturnTypeModel } from './../models/SignIn';


export type authUserFunctionReturnType = userTypeModel & {
    success: boolean;
    msg: string;
}
export type AuthContextProviderProps = {
    children?: ReactNode
};
export type signResponseType = {
    success?: boolean;
    error?: any;
    msg?: string;
    code?: number;
    auth_token?: string;
    data?: {
        auth_at?: number;
        id?: number;
        host?: string;
        logo?: string;
        titulo?: string;
        descricao?: string;
        endereco?: string;
        lat_lng?: string[];
        username?: string;
        chave_privada_de_acesso?: string;
    };
    response_time?: number;
    expirate_time?: number;
    redirect_url?: string;
}
export type AuthUserTypeContext = {
    user: userTypeModel | undefined;
    setUser: (userData: userTypeModel) => void;
    authUser: () => Promise<authUserFunctionReturnType>;
    singIn: (data: signInPropsModel) => Promise<singInFunctionReturnTypeModel | any>
};
export const AuthContext = createContext({} as AuthUserTypeContext);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<userTypeModel>();

    async function authUser() {
        var authUserPromise = new Promise<authUserFunctionReturnType>((resolve, reject) => {
            var resolvePromiseTimeout = setTimeout(function () {
                resolve({
                    success: false,
                    msg: 'Auth user timed out! After 8 seconds without any auth answer,  we do trigger auth user timeout error.',
                    user_id: 0,
                    username: '',
                    password: '',
                    hostname: '',
                    address: '',
                    location: { lat: 0, lng: 0 },
                });
            }, 8000);
            Z.ajax({
                method: "GET",
                url: 'http://localhost:8181/Auth/user/',
                with_credentials: true,
                response_type: 'json',
                success: function (data: any) {
                    clearTimeout(resolvePromiseTimeout);
                    if (data?.success) {
                        setUser({
                            user_id: data?.id,
                            username: data?.username,
                            password: '',
                            hostname: data?.host,
                            address: data?.address,
                            location: { lat: data?.location?.lat, lng: data?.location?.lng },
                        });
                    }
                    resolve({
                        success: data?.success,
                        msg: data?.msg,
                        user_id: 0,
                        username: data?.username,
                        password: '',
                        hostname: data?.host,
                        address: data?.address,
                        location: { lat: data?.location?.lat, lng: data?.location?.lng },
                    });
                },
                error: function (error: any) {
                    clearTimeout(resolvePromiseTimeout);
                    var data = error?.responseJSON || { success: false, msg: 'unknown user auth error' };
                    resolve({
                        success: data?.success,
                        msg: data?.msg,
                        user_id: 0,
                        username: data?.username,
                        password: '',
                        hostname: data?.host,
                        address: data?.address,
                        location: { lat: data?.location?.lat, lng: data?.location?.lng },
                    });
                }
            });
        });
        return await authUserPromise;
    }

    async function singIn(data: signInPropsModel): Promise<singInFunctionReturnTypeModel> {
        var signInResponse = await SignInModel(data);
        if (signInResponse.success) {
            setUser(signInResponse.user);
        }
        return signInResponse;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, authUser, singIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}
