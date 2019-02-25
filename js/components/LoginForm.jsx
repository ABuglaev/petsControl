import './LoginForm.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {signUp, logIn} from '../AJAX.js';

export default class PostForm extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let onLogInButtonClick = () =>{
      let formData = new FormData();
      formData.append('login', document.getElementById('login').value);
      formData.append('password', document.getElementById('password').value);

      //send formdata using function from AJAX.js
      logIn(formData);
    };

    document.getElementsByClassName('loginForm')[0].addEventListener('submit', (e) => { e.preventDefault(); onLogInButtonClick(); });
  }

  render() {
    return (
      <form className='loginForm' name='loginForm'>
      <div className='container-fluid'>
        <div className="row">
          <div className="col-12">
            <input type='text' id='login' placeholder=' login(email) ' required='required'/>
          </div>
          <div className="col-12">
            <input type='password' id='password' placeholder=' password' required='required'/>
          </div>
          <div className="col-12">
            <button className='button loginButton btn-primary'   id='loginButton'  >Log In !</button>
          </div>
        </div>
      </div>
      <a href='#passwordReset'>Forgot your password?</a>
      </form>
      
      
    );
  }
}


