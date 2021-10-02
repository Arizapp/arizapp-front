import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AccountCircle, ArrowForwardIos, Lock, WhatsApp } from '@material-ui/icons';
import { ButtonDefault } from '../../components/buttons/default';
import { ButtonPrimary } from '../../components/buttons/primary';
import './index.scss';
import { QueroConhecer } from './queroConhecer';
import { useAuth } from '../../hooks/Auth';
export type singHandleProps = {
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

export function CadastroPage() {
    var authContexted = useAuth();

    let userHistory = useHistory();
    
    const [asideContent, setAsideContentState] = useState('default');
    const setAsideContentOnClick = function (content: string) {
        setAsideContentState(content);
        return;
    }
    const AsideDefaultContent = function (): JSX.Element {
        return (
            <>
                <h1>Arizapp</h1>
                <ButtonDefault onClick={(ev) => { return setAsideContentOnClick('queroConhecer'); }}>Quero conhecer</ButtonDefault>
            </>
        );
    }

    function goTo(urlPath: string) {
        userHistory.push(urlPath);
        return;
    }

    function singUpFormSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        const target = ev.target as typeof ev.target & {
            whatsapp: { value: string };
            username: { value: string };
            password: { value: string };
        };
        //Verificar porque os dados não estão sendo enviados
        Z.ajax({
            url: 'http://localhost:8181/Administracao/user/publicApi/createAccount/',
            method: 'POST',
            response_type: 'json',
            with_credentials: false,
            //headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
                hostname: target.username.value + ".alunocleber",
                hostserver: "sv1.arizapp.com.br",
                whatsapp: target.whatsapp.value,
                username: target.username.value,
                password: target.password.value,
                accesskey: "ALUNOCLEBERV1",
                titulo: "Nome da empresa",
                descricao: "Cadastro em andamento",
                endereco: "Endereço comercial de atendimento."
            },
            success: function (data: singHandleProps) {
                console.log('Success ajax function return: ', data);
                if (!data.success) {
                    signUpHandleError(data);
                    return;
                }
                signUpHandleSuccess(data);
            },
            error: function (response) {
                console.log('Error ajax function return: ', (response?.responseJSON || response));
                signUpHandleError((response?.responseJSON || { success: false, error: 'unknown_error', msg: 'Erro não conhecido.' }));
            }

        });
        console.log('Form Event target:', target.whatsapp.value, target.username.value, target.password.value);
        return false;
    }

    async function signUpHandleSuccess(data: singHandleProps) {
        const [hostName, username, password] = [(data.data?.cliente_host_data?.host || 'no-host-founded'), (data.data?.usuario_data?.username || '-'), (data.data?.usuario_data?.password || '-')];
        console.log('signUpHandleSuccess: ', data);
        if (1 === 1) {
            var singInResult = await authContexted.singIn({
                hostname: hostName,
                username: username,
                password: password
            });
        } else {
            Z.ajax({
                method: 'POST',
                url: 'http://localhost:8181/Login/index/sign/',
                with_credentials: true,
                headers: { "Authorization": "Credentials " + hostName + ":" + username + "@" + password, },
                data: { remember_me: true },
                success: function (data) {
                    console.log('Login response: ', data);
                },
                error: function (response) {
                    console.log(response?.responseJSON || response);
                }
            });
        }

    }

    function signUpHandleError(dataHandle: singHandleProps) {
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
        errorLabelList.map(errorLabel => {
            var label = errorLabel as keyof typeof errorsLabel;
            var errorMessage = (errorsLabel[label]?.msg || '-');
            alert(errorMessage);
            return errorMessage;
        });
        return;
    }

    return (
        <main>
            <aside>
                {(asideContent === 'queroConhecer' ? <QueroConhecer /> : <AsideDefaultContent />)}
                <button onClick={event => { goTo('/login') }}>Go to Login</button>
            </aside>
            <div className="content">
                <div className="content-indicate arrow">
                    <ArrowForwardIos sx={{ fontSize: '60px' }} />
                    <span>Cadastrar</span>
                </div>
                <div className="content-container">
                    <div className="formContent">
                        <form method="post" id="signUpForm" onSubmit={singUpFormSubmit}>
                            <div className="formContent-area formContent-header">
                                <h1>Cadastrar</h1>
                            </div>
                            <div className="formContent-area formContent-body">
                                <div className="input-group inline">
                                    <span><WhatsApp sx={{ fontSize: '2.0em' }} /></span>
                                    <input type="text" className="form-control" name="whatsapp" placeholder="Whatsapp" />
                                </div>
                                <div className="input-group inline">
                                    <span><AccountCircle sx={{ fontSize: '2.0em' }} /></span>
                                    <input type="text" className="form-control" name="username" placeholder="Username" />
                                </div>
                                <div className="input-group inline">
                                    <span><Lock sx={{ fontSize: '2.0em' }} /></span>
                                    <input type="password" className="form-control" name="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="formContent-area formContent-footer">
                                <div className="input-group inline">
                                    <ButtonPrimary className="form-control">Entrar</ButtonPrimary>
                                </div>
                                <Link to="/login">Entrar na sua conta</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}