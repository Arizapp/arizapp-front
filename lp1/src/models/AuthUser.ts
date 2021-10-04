export type AuthUserAjaxCallResponse = {
    success: boolean;
    error?: string | undefined | any;
    user_data?: {
        auth_at?: number;
        id: number;
        host: string;
        logo: string;
        titulo: string;
        descricao: string;
        endereco: string;
        lat_lng: [string, string];
        username: string;
        chave_privada_de_acesso: string;
        iat: number;
        exp: number;
        auth_token: string;
    } | {} | undefined;
}
export async function AuthUser(): Promise<AuthUserAjaxCallResponse> {
    return new Promise<AuthUserAjaxCallResponse>((resolve, reject) => {
        var resolvePromiseTimeout = setTimeout(function () {
            resolve({
                success: false,
                error: 'Auth user timed out! After 8 seconds without any auth answer, we do a trigger timeout auth user error.'
            });
        }, 8000);
        Z.ajax({
            method: "GET",
            url: 'http://localhost:8181/Auth/user/',
            with_credentials: true,
            response_type: 'json',
            success: function (data: AuthUserAjaxCallResponse) {
                clearTimeout(resolvePromiseTimeout);
                resolve(data);
            },
            error: function (error: any) {
                clearTimeout(resolvePromiseTimeout);
                var data = error?.responseJSON || { success: false, msg: 'unknown user auth error' };
                resolve({
                    success: data?.success,
                    error: (error?.responseJSON || error),
                });
            }
        });
    });
}
