import { SignIn, singInFunctionReturnType, userType } from './SignIn';

export type createAccountProps = {
    hostname: string;
    hostserver: string;
    whatsapp: string;
    username: string;
    password: string;
    accesskey: string;
    titulo: string;
    descricao: string;
    endereco: string;
};

export type createAccountResponseType = {
    success: boolean;
    error?: "field_missing" | "required_fields_validate_error" | "define_account_data_error" | "client_host_already_exist" | "search_for_existent_client_host_error" | "create_client_host_error" | "user_already_exist" | "search_for_existent_user_error" | "service_menu_not_found" | "client_host_already_exist_and_was_not_deleted" | "get_service_menu_error" | "client_host_was_not_deleted" | "rewrite_request_to_user_data_error" | "create_user_error" | "field_type_error" | "field_length_error" | "set_whatsapp_number_error" | "user_was_not_deleted" | "rewrite_request_to_zap_numero_data_error" | "create_zap_numero_error" | "unknown_error";
    field?: string;
    fields_missing?: Array<string>;
    msg: string;
    data?: {
        cliente_host_data?: {
            id: number;
            host: string;
        };
        usuario_data?: {
            id: number;
            username: string;
            password: string;
        };
        zap_numero_data?: {
            id: number;
            usuarios_menus_de_atendimento_id: number;
            zap_numero_codigo_pais: number;
            zap_numero_codigo_de_area: number;
            zap_numero: number;
        };
    }
};

export type singUpFunctionReturnType = {
    success?: boolean,
    msg?: string,
    error?: any,
    user?: userType | undefined;
};

export async function signUp(accountData: createAccountProps): Promise<singUpFunctionReturnType> {
    var response: singUpFunctionReturnType = { success: false, msg: 'unknown error yet.', error: undefined, user: undefined };
    var createAccountResponse: createAccountResponseType = { success: false, msg: '' };
    try {
        //Create account
        try {
            createAccountResponse = await createAccount(accountData);
        } catch (e) {
            throw new Error('Errro ao tentar criar conta.');
        }
        //V
        if (!createAccountResponse?.success) {
            try {
                var errorsMessages = signUpHandleError(createAccountResponse);
                response.msg = errorsMessages.join(' and ');
                return response;
            } catch (e) {
                throw new Error('Errro ao tentar formatar os erros internos da criação de conta.');
            }
        }
        try {
            var signInResult = await signInUpHandleSuccess(createAccountResponse);
            return signInResult;
        } catch (e) {
            throw new Error('Errro ao tentar validar erros internos da criação de conta.');
        }

    } catch (e: any) {
        return { success: false, msg: e.message };
    }
}


async function createAccount(accountData: createAccountProps): Promise<createAccountResponseType> {
    return new Promise((resolve, reject) => {
        var promiseTimeout = setTimeout(function () {
            resolve({ success: false, msg: 'Create account response timeout.' });
        }, 8000);
        Z.ajax({
            url: 'http://localhost:8181/Administracao/user/publicApi/createAccount/',
            method: 'POST',
            response_type: 'json',
            with_credentials: false,
            //headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: accountData,
            success: function (createAccountResponse: createAccountResponseType) {
                clearTimeout(promiseTimeout);
                resolve(createAccountResponse);
            },
            error: function (response) {
                var createAccountResponse = (response?.responseJSON || { success: false, error: 'unknown_error', msg: 'Erro não conhecido.' });
                clearTimeout(promiseTimeout);
                resolve(createAccountResponse);
            }
        });
    });
}


async function signInUpHandleSuccess(dataHandle: createAccountResponseType): Promise<singInFunctionReturnType> {
    try {
        var Hostname = dataHandle?.data?.cliente_host_data?.host || '';
        var Username = dataHandle?.data?.usuario_data?.username || '';
        var Password = dataHandle?.data?.usuario_data?.password || '';
        var signInResult = await SignIn({
            hostname: Hostname,
            username: Username,
            password: Password
        });
        return signInResult;
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

function signUpHandleError(dataHandle: createAccountResponseType): string[] {
    /**
     * @type {Record<string, string>}
     */
    var errorsLabel = {
        'field_missing': { msg: 'O(s) campos obrigatório(s) pela requisição [' + (dataHandle?.fields_missing?.join(',') || '') + '] não foi/foram recebido(s)' },
        'required_fields_validate_error': { msg: 'Houve um erro não identificado sobre os campos obrigatórios da requisição. Por favor tente novamente.' },
        'define_account_data_error': { msg: 'Houve um erro ao definir os dados da conta. Por favor tente novamente.' },
        'client_host_already_exist': { msg: 'Já existe um cliente com o mesmo nome de usuário.' },
        'search_for_existent_client_host_error': { msg: 'Houve um erro ao verificar se já existe um cliente com o mesmo nome de usuário.' },
        'create_client_host_error': { msg: 'Houve um erro ao criar a conta do cliente.' },
        'user_already_exist': { msg: 'Usuário já existe no sistema.' },
        'search_for_existent_user_error': { msg: 'Houve um erro ao verificar se já existe um usuário.' },
        'service_menu_not_found': { msg: 'Menu de atendimento padrão do sistema não encontrado para criar a conta.' },
        'client_host_already_exist_and_was_not_deleted': { msg: 'Houve um erro ao tentar deletar os dados de cliente cadastrado com erro. Tente se cadastrar novamente.' },
        'get_service_menu_error': { msg: 'Erro ao buscar o menu de atendimento padrão do sistema para criação da conta.' },
        'client_host_was_not_deleted': { msg: 'Houve um erro ao tentar deletar os dados de cliente com erro. Tente se cadastrar novamente.' },
        'rewrite_request_to_user_data_error': { msg: 'Houve um erro ao formatar os dados da requisição para criação do usuário.' },
        'create_user_error': { msg: 'Erro ao tentar criar o usuário' },
        'field_type_error': { msg: 'O tipo do campo ' + (dataHandle?.field || '-') + ' recebido não é válido! Tente novamente.' },//field
        'field_length_error': { msg: 'A quantidade de caracteres do campo ' + (dataHandle?.field || '-') + ' não são suficientes.' },//field
        'set_whatsapp_number_error': { msg: 'O número de whatsapp fornecido não está correto!' },
        'user_was_not_deleted': { msg: 'Erro ao tentar deletar os dados do usuário com erro. Por favor tente novamente.' },
        'rewrite_request_to_zap_numero_data_error': { msg: 'Houve um erro ao formatar os dados da requisição para criação do número Whatsapp. Por favor tente novamente.' },
        'create_zap_numero_error': { msg: 'Erro ao tentar criar o número Whatsapp' },
        'unknown_error': { msg: 'Houve um erro desconhecido no sistema. Por favor, tente novamente mais tarde.' }
    };

    var errorLabelList = (dataHandle?.error && dataHandle.error.split(';') || []);
    errorLabelList = errorLabelList.map(errorLabel => {
        var label = errorLabel as keyof typeof errorsLabel;
        var errorMessage = (errorsLabel[label]?.msg || '-');
        //alert(errorMessage);
        return errorMessage;
    });
    return errorLabelList;
}