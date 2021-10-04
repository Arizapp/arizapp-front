import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AccountCircle, ArrowForwardIos, Lock, WhatsApp } from '@material-ui/icons';
import { ButtonDefault } from '../../components/buttons/default';
import { ButtonPrimary } from '../../components/buttons/primary';
import './index.scss';
import { QueroConhecer } from './queroConhecer';
import { useAuth } from '../../hooks/Auth';

export function CadastroPage() {
    const [asideContent, setAsideContentState] = useState('default');
    var authContexted = useAuth();
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

    function singUpFormSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        const target = ev.target as typeof ev.target & {
            whatsapp: { value: string };
            username: { value: string };
            password: { value: string };
        };
        console.log('target: ', target);
        return false;
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