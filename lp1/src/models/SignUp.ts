import { SignIn, singInFunctionReturnType as singInFunctionReturnTypeModel, userType } from './SignIn';
import { createInfo as CreateAuxiliarInfoModel, CreateInfoResponseType as CreateAuxiliarInfoResponseType } from './VerticalAuxiliarInfoApi';
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
    error_label?: "create_account_failure" | "sign_in_user_error" | "unknow" | undefined;
    user?: userType | undefined;
};

export type createAuxiliarInfoForCreatedAccountProps = {
    user_id: number;
    info_value: Array<any> | Record<string, any> | string | number;
};

export async function signUp(accountData: createAccountProps): Promise<singUpFunctionReturnType> {
    var response: singUpFunctionReturnType = {
        success: false,
        msg: 'unknown error yet.',
        error: 'unknow',
        error_label: 'unknow',
        user: undefined
    };
    var createAccountResponse: createAccountResponseType = { success: false, msg: '' };
    try {
        //Create account
        try {
            createAccountResponse = await createAccount(accountData);
        } catch (e) {
            throw new Error('Errro ao tentar criar conta.');
        }
        //Create account failure - Try to return response with errors messages identifying what's happend to UX triggers actions.
        if (!createAccountResponse?.success) {
            try {
                var errorsMessages = signUpHandleError(createAccountResponse);
                response.success = false;
                response.msg = errorsMessages.join(';');
                response.error_label = 'create_account_failure';
                response.error = 'Some error has occurred while creating your account.';
                return response;
            } catch (e) {
                throw new Error('Error when try to format the internal errors messages for the create account action. Try to log in with yout sing up data.');
            }
        }

        //Cria informação auxiliar sobre a criação da conta.
        try {
            var auxiliarInfoResponse = await createAuxiliarInfoForCreatedAccount({
                user_id: (createAccountResponse.data?.cliente_host_data?.id || 0),
                info_value: 'missing_account_data'
            });
            if (!auxiliarInfoResponse.success) {
                throw new Error('Create auxiliar info for sing up account failed. ' + auxiliarInfoResponse.msg);
            }
        } catch (e: any) {
            console.log(e);
        }

        //Create account success - Try to return response with signIn user data. 
        try {
            var signInResult = await signInUpHandleSuccess(createAccountResponse);
            if (!signInResult?.success) {
                response.success = false;
                response.msg = signInResult?.msg || 'Try to sign in user returned some Unknow error reason.';
                response.error = signInResult?.error || 'unknow';
                response.error_label = 'sign_in_user_error';
                response.user = undefined;
                return response;
            }
            response.success = true;
            response.msg = 'User signed in successfully!';
            response.error = undefined;
            response.error_label = undefined;
            response.user = signInResult?.user;
            return response;
        } catch (e) {
            throw new Error('Error while try to sign in user data.');
        }
    } catch (e: any) {
        response.success = false;
        response.msg = e.message;
        return response;
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
                clearTimeout(promiseTimeout);
                var createAccountResponse = (response?.responseJSON || { success: false, error: 'unknown_error', msg: 'Erro não conhecido.' });
                resolve(createAccountResponse);
            }
        });
    });
}

async function createAuxiliarInfoForCreatedAccount(createAuxiliarInfoForCreatedAccount: createAuxiliarInfoForCreatedAccountProps): Promise<CreateAuxiliarInfoResponseType> {
    try {
        var createAuxiliarInfoResponse = await CreateAuxiliarInfoModel({
            info_label: 'sign_up_status',
            info_key: 'user_' + createAuxiliarInfoForCreatedAccount.user_id,
            info_value: createAuxiliarInfoForCreatedAccount.info_value
        });
        return createAuxiliarInfoResponse;
    } catch (e: any) {
        return { success: false, msg: e.message };
    }
}

async function signInUpHandleSuccess(dataHandle: createAccountResponseType): Promise<singInFunctionReturnTypeModel> {
    console.log('SignUp success handle data: ', dataHandle);
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
        return { success: false, error: e.message, msg: 'Some error occurred while try to sign in user account.' };
    }
}

function signUpHandleError(dataHandle: createAccountResponseType): string[] {
    var consoleLog = true;

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

    if (consoleLog) {
        console.log('********* SignUp Error *********');
        console.log('List of possible errors: ', errorsLabel);
        console.log('Error data handled: ', dataHandle);
    }

    var errorLabelList = (dataHandle?.error ? dataHandle.error.split(';') : []);
    errorLabelList = errorLabelList.map(errorLabel => {
        var label = errorLabel as keyof typeof errorsLabel;
        var errorMessage = (errorsLabel[label]?.msg || 'Message for ' + label + ' not founded.');
        if (consoleLog) {
            console.log(label, errorMessage);
        }
        return errorMessage;
    });
    if (consoleLog) {
        console.log('Errors message list return: ', errorLabelList);
        console.log('********* SignUp Error *********');
    }
    return errorLabelList;
}