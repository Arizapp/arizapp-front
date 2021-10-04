import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AccountCircle, ArrowForwardIos, Lock, WhatsApp } from '@material-ui/icons';
import './index.scss';

import { ButtonDefault } from '../../components/buttons/default';
import { ButtonPrimary } from '../../components/buttons/primary';
import { QueroConhecer } from './queroConhecer';
import { signUp as SignUpModel, createAccountProps as SignUpProps } from '../../models/SignUp';

import { AuthContextProviderType as AuthHookProvided } from "./../../contexts/AuthContext";
import { useAuth } from '../../hooks/Auth';

export function CadastroPage() {
    const [asideContent, setAsideContentState] = useState('default');
    var { user, authUser } = useAuth();
    let userHistory = useHistory();

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

    async function singUpFormSubmit(ev: FormEvent<HTMLFormElement>): Promise<void> {
        ev.preventDefault();
        const target = ev.target as typeof ev.target & {
            whatsapp: { value: string };
            username: { value: string };
            password: { value: string };
        };
        console.log('target: ', [target.whatsapp.value, target.username.value, target.password.value]);
        try {
            var signUpResponse = await SignUpModel({
                hostname: target.username.value + ".alunocleber",
                hostserver: "sv1.arizapp.com.br",
                username: target.username.value,
                password: target.password.value,
                whatsapp: target.whatsapp.value,
                titulo: 'Nome da empresa.',
                endereco: 'Endereço comercial de atendimento.',
                descricao: 'Cadastro em andamento.',
                accesskey: 'ALUNOCLEBERVBETA1'
            });
            if (!signUpResponse?.success) {
                /**
                 * @type {"create_account_failure" | "sign_in_user_error" | "unknow" | undefined | false}
                 */
                var errorLabel = signUpResponse?.error_label || false;
                if (errorLabel === "create_account_failure") {
                    (signUpResponse?.msg?.split(';') || ['Algum erro não conhecido ocorreu durante a criação da conta. Por favor, tente logar com seus dados, se não obtiver sucesso, tente criar uma nova conta.'])
                        .map(errorMessage => {
                            alert(errorMessage);
                            return errorMessage;
                        });
                    return;
                }
                alert('Erro' + (' "' + errorLabel + '"' || '') + ' retornou a seguinte mensagem: ' + (signUpResponse?.msg || 'Mensagem do erro de criação de conta não foi identificada :/ Por favor. Tente novamente!'));
                return;
            }
            try {
                var userAuthData = await authUser();
                if (!userAuthData?.success) {
                    alert((typeof userAuthData?.error === 'string' && userAuthData?.error.length > 0 ? userAuthData?.error : 'Não foi possível autenticar o usuário. Por favor, tente novamente.'));
                    console.log(userAuthData);
                    return;
                }
                alert('Usuário autenticado com sucesso!');
                console.log('Auth user sucess data: ', userAuthData);
                return;
            } catch (e: any) {
                alert('Erro ao tentar autenticar usuário de forma automática! Por favor, faça login manualmente.');
            }
        } catch (e: any) {
            alert('SignUp error: ' + e.message);
        }
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