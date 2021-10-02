
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
    msg?: string;
    user?: userType;
};

export async function SignIn() {
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