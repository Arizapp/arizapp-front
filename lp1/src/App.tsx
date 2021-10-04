import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import './App.css';

import { LoginPage } from './pages/home/login';
import { CadastroPage } from './pages/home/cadastro';

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/cadastro" exact component={CadastroPage} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
