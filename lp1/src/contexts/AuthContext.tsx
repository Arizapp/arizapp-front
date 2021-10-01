import { createContext, ReactNode, useState, useEffect } from "react";
export type singInFunctionProps = {
    username?: string;
    password?: string;
    hostname?: string;
}

export type userType = {
    user_id: number;
    username?: string;
    password?: string;
    hostname?: string;
    address?: string;
    location?: { lat: number, lng: number };
}

export type singInFunctionReturnType = {
    success: boolean;
    msg?: string;
    user?: userType;
};
export type authUserFunctionReturnType = userType & {
    success: boolean;
    msg: string;
}
export type AuthUserTypeContext = {
    user: userType | undefined;
    setUser: (userData: userType) => void;
    authUser: () => Promise<authUserFunctionReturnType>;
    singIn: (data: singInFunctionProps) => Promise<void>
};

export const AuthContext = createContext({} as AuthUserTypeContext);

export type AuthContextProviderProps = {
    children?: ReactNode
};

export type signResponseType = {
    success?: boolean;
    error?:any;
    msg?: string;
    code?: number;
    auth_token?: string;
    data?: {
        auth_at?: number;
        id?: number;
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

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<userType>();
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
                            user_id: 0,
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

    async function singIn(data: singInFunctionProps) {

        async function doAjaxSignIn(username: string, password: string, hostname: string, successCallBack: (data: any) => void, errorCallBack: (data: any) => void) {
            var singInPromise = new Promise<singInFunctionReturnType>((resolve) => {
                var singInPromiseTimeOut = setTimeout(() => {
                    resolve({
                        success: false,
                        msg: 'Sing In Promise timeout exceded.'
                    });
                }, 8000);
                Z.ajax({
                    method: 'POST',
                    url: 'http://localhost:8181/Login/index/sign/',
                    with_credentials: true,
                    headers: { "Authorization": "Credentials " + hostname + ":" + username + "@" + password, },
                    data: { remember_me: true },
                    success: function (data: signResponseType) {
                        clearTimeout(singInPromiseTimeOut);
                        var userData: userType = {
                            user_id: (data?.clientes_host_id || 0),
                            username: (data?.clientes_host_id || ''),
                            password: (data?.clientes_host_id || ''),
                            hostname: (data?.clientes_host_id || ''),
                            address: (data?.clientes_host_id || ''),
                            location: { lat: (data?.clientes_host_id || 0), lng: (data?.clientes_host_id || 0) }
                        }
                        resolve({
                            success: true,
                            msg: 'Aparentemente sucesso em entrar.',
                            user: userData
                        });
                        console.log('Login response: ', data);
                        successCallBack(data);
                    },
                    error: function (response) {
                        clearTimeout(singInPromiseTimeOut);
                        var data = (response?.responseJSON || response);
                        console.log('Login error response: ', data);
                        resolve({
                            success: false,
                            msg: 'Algum erro aconteceu',
                            user: data
                        });
                        errorCallBack(data);
                    }
                });
            });
        }

        const successAjaxSignInCallback = async function (data: any) {
            console.log('successAjaxSignInCallback Handle: ', data);
            setUser(data);
            return;
        }

        const errorAjaxSignInCallback = async function (data: any) {
            console.log('errorAjaxSignInCallback Handle: ', data);
            return;
        }

        var singInResult = await doAjaxSignIn(
            (data?.username || ''), (data?.password || ''),
            (data?.hostname || ''),
            successAjaxSignInCallback,
            errorAjaxSignInCallback
        );
        console.log('Sing In Result: ', singInResult);
        return;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, authUser, singIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}
