import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle, ArrowForwardIos, Lock } from '@material-ui/icons';
import { ButtonDefault } from '../../components/buttons/default';
import { ButtonPrimary } from '../../components/buttons/primary';
import './index.scss';
import { QueroConhecer } from './queroConhecer';


export function LoginPage() {
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

    return (
        <main>
            <aside>
                {(asideContent === 'queroConhecer' ? <QueroConhecer /> : <AsideDefaultContent />)}
            </aside>
            <div className="content">
                <div className="content-indicate arrow">
                    <ArrowForwardIos sx={{ fontSize: '60px' }} />
                    <span>Login</span>
                </div>
                <div className="content-container">
                    <div className="formContent">
                        <form>
                            <div className="formContent-area formContent-header">
                                <h1>Entrar</h1>
                            </div>
                            <div className="formContent-area formContent-body">
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
                                <Link to="/cadastro">Criar conta</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}