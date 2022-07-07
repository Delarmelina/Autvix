import React, { Component } from 'react';

import './style.css';
import logo from '../../assets/logovertical.png'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className='login-container'>
        <div className="container">
          <div className="formContent">
            <div className="fadeIn first">
              <img src={logo} alt="Logo" className='logo' />
            </div>

            <form>
              <input type="text" id="login" className="fadeIn second" name="login" placeholder="Email" />
              <input type="password" id="password" className="fadeIn third mt-2" name="login" placeholder="Senha" />
              <input type="button" className="fadeIn fourth mt-4" value="Entrar" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
