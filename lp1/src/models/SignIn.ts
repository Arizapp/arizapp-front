import { getInfo as GetAuxiliarInfoModel, getInfoResponseType as GetAuxiliarInfoType } from './VerticalAuxiliarInfoApi';

export type signResponseType = {
    success?: boolean;
    error?: any;
    msg?: string;
    code?: number;
    auth_token?: string;
    data?: {
        auth_at: number | string | undefined;
        id: number | string | undefined;
        host: string | undefined;
        logo: string | undefined;
        titulo: string | undefined;
        descricao: string | undefined;
        endereco: string | undefined;
        lat_lng: [string | number, string | number];
        username: string | undefined;
        chave_privada_de_acesso: string | number | undefined;
    };
    response_time?: number;
    expirate_time?: number;
    redirect_url?: string;
}
export type userType = {
    user_id: number | string | undefined;
    username: string | undefined;
    password?: string;
    hostname: string | undefined;
    address: string | undefined;
    description: string | undefined;
    location?: { lat: number | string | undefined, lng: number | string | undefined };
    sing_up_status?: GetAuxiliarInfoType;
}

export type singInFunctionReturnType = {
    success: boolean;
    error?: any;
    msg?: string;
    user?: userType | undefined;
};
export type signInProps = {
    hostname: string;
    username: string;
    password: string;
};
export async function SignIn(signInData: signInProps): Promise<singInFunctionReturnType> {
    var signInResponse = await DoSignIn(signInData);
    try {
        if (signInResponse?.success && signInResponse?.user) {
            var auxiliarInfo = await GetAuxiliarInfoModel({
                info_key: 'user_' + (signInResponse?.user?.user_id || 0),
                info_label: 'sign_up_status'
            });
            signInResponse.user.sing_up_status = auxiliarInfo;
        }
    } catch (e: any) {
        console.log(e);
    }
    return signInResponse;
}
export async function DoSignIn(signInData: signInProps): Promise<singInFunctionReturnType> {
    var { hostname, username, password } = signInData;
    return new Promise<singInFunctionReturnType>((resolve) => {
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
            headers: { "Authorization": "Credentials " + hostname + ":" + username + "@" + password },
            data: { remember_me: true },
            success: function (signResponse: signResponseType) {
                clearTimeout(singInPromiseTimeOut);
                var userData: userType = {
                    user_id: (signResponse?.data?.id || 0),
                    username: (signResponse?.data?.username || ''),
                    password: '',
                    hostname: (signResponse?.data?.host || 'unknowserver.arizapp.com.br'),
                    address: (signResponse?.data?.endereco || ''),
                    description: (signResponse?.data?.descricao || ''),
                    location: { lat: signResponse?.data?.lat_lng[0] || 0, lng: signResponse?.data?.lat_lng[1] }
                }
                resolve({
                    success: true,
                    msg: 'Aparentemente sucesso em entrar.',
                    user: userData
                });
                console.log('SignInResponse response: ', signResponse);
            },
            error: function (response) {
                clearTimeout(singInPromiseTimeOut);
                var data = (response?.responseJSON || response);
                console.log('Login error response: ', data);
                resolve({
                    success: false,
                    msg: 'Unknow error when try to sign in user.',
                    error: data
                });
            }
        });
    });
}