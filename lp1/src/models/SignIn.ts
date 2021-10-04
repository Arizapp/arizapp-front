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
        lat_lng?: [string, string];
        username?: string;
        chave_privada_de_acesso?: string;
    } | undefined;
    response_time?: number;
    expirate_time?: number;
    redirect_url?: string;
}
export type userType = {
    user_id: number;
    username?: string;
    password?: string;
    hostname?: string;
    address?: string;
    description?: string;
    location?: { lat: number, lng: number };
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

export async function SignIn(signInData: signInProps) {
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
            headers: { "Authorization": "Credentials " + hostname + ":" + username + "@" + password, },
            data: { remember_me: true },
            success: function (data: signResponseType) {
                clearTimeout(singInPromiseTimeOut);
                var userData: userType = {
                    user_id: (data?.data?.id || 0),
                    username: (data?.data?.username || ''),
                    password: '',
                    hostname: (data?.data?.host || 'unknowserver.arizapp.com.br'),
                    address: (data?.data?.endereco || ''),
                    description: (data?.data?.descricao || ''),
                    location: { lat: parseInt((data?.data?.lat_lng && data?.data?.lat_lng[0] || '0')), lng: parseInt((data?.data?.lat_lng && data?.data?.lat_lng[1] || '0')) }
                }
                resolve({
                    success: true,
                    msg: 'Aparentemente sucesso em entrar.',
                    user: userData
                });
                console.log('Login response: ', data);
            },
            error: function (response) {
                clearTimeout(singInPromiseTimeOut);
                var data = (response?.responseJSON || response);
                console.log('Login error response: ', data);
                resolve({
                    success: false,
                    msg: 'Algum erro aconteceu',
                    error: data
                });
            }
        });
    });
}