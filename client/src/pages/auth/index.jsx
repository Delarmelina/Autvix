import React, { Component } from 'react';

import './style.css';
import logo from '../../assets/logovertical.png'

import { login } from '../../services/methods/usermethods';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      codeError: 0,
    };
  }

  sendLogin = async () => {
    this.setState({ codeError: await login(this.state.email, this.state.password) }, () => {
      
      if (this.state.codeError === 0) {
        window.location.href = '/';
      }
    });
  }

  render() {
    return (
      <div className='login-container'>
        <div className="container">
          <div className="formContent">
            <div className="fadeIn first">
              <img src={logo} alt="Logo" className='logo' />
            </div>

            <label className={`ann ${this.state.codeError > 0 ? "opacity-100 mb-2" : "opacity-0"}`}>{
              this.state.codeError === 1 ? "Usuário não encontrado" :
                this.state.codeError === 2 ? "Senha incorreta" : null
            }</label>

            <form>
              <input type="text" id="login" className={`fadeIn second ${this.state.codeError === 1 ? "border-danger" : ""}`} name="login" placeholder="Email"
                onChange={(event) => this.setState({ email: event.target.value })} value={this.state.email} />

              <input type="password" id="password" className={`fadeIn third mt-2 ${this.state.codeError === 2 ? "border-danger" : ""}`} name="login" placeholder="Senha"
                onChange={(event) => this.setState({ password: event.target.value })} value={this.state.password} />

              <input type="button" className="fadeIn fourth mt-4" value="Entrar"
                onClick={() => { this.sendLogin() }} />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
