import { useEffect } from 'react';
import { useAuth } from './../../../hooks/Auth';
import { ButtonPrimary } from './../../../components/buttons/primary';
import { FaBeer } from 'react-icons/fa';

import './continuacaoCadastro.scss';

export function ContinuacaoCadastro() {
    return (
        <>
            <ContinuacaoCadastroHeader />
            <main>
                <h1 title="Finalize seu cadastro">Finalize seu cadastro</h1>
                <div className="form-content">
                    <div className="inputs-row">
                        <div className="fileInput-area">
                            <div className="file-preview">
                                <div className="file-label">
                                    <label htmlFor="logo">Carregar imagem</label>
                                    <input type="file" id="logo" name="logo" />
                                </div>
                            </div>

                        </div>
                        <div className="input-area">
                            <label htmlFor="titulo">Nome da empresa</label>
                            <input type="text" name="titulo" id="titulo" className="form-control" />
                        </div>
                    </div>
                    <div className="inputs-row">
                        <div className="input-area">
                            <label htmlFor="endereco">Endereço</label>
                            <input type="text" name="endereco" id="endereco" className="form-control" />
                        </div>
                        <div className="input-area">
                            <label htmlFor="descricao">Descrição</label>
                            <input type="text" name="descricao" id="descricao" className="form-control" />
                        </div>
                    </div>
                    <div className="inputs-row">
                        <div className="input-area">
                            <label htmlFor="googlelink">Link da localização no google maps</label>
                            <input type="text" name="googlelink" id="googlelink" className="form-control" />
                        </div>
                    </div>
                    <div className="inputs-row">
                        <div className="input-area">
                            <ButtonPrimary type="submit">Salvar dados</ButtonPrimary>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}

export function ContinuacaoCadastroHeader() {
    var { user } = useAuth();
    useEffect(() => {
        console.log('ContinuacaoCadastroHeader');
        if (!user) {
            alert('No user logged!');
        }
    }, []);

    var avatar = "https://ui-avatars.com/api/?size=128&background=680000&color=fff&name=" + encodeURI((user?.username || 'X') + " Ariza");
    return (
        <header>
            <div className="container">
                <div className="logo">
                    Arizapp
                </div>
                <ul>
                    <li className="dropdown-float">
                        <a href="javscript:void(0)" className="imageArea">
                            <img src={avatar || undefined} alt="avatar" title="avatar"></img>
                        </a>
                        <ul>
                            <li>
                                <a href="javascript:void(0)">
                                    <FaBeer /> Minha conta
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
}