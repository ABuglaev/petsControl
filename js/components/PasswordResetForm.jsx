import './PasswordResetForm.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {signUp, logIn, changePassword} from '../AJAX.js';

export default class PostForm extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let onResetSubmit = () =>{
      let formData = new FormData();
      formData.append('email', document.getElementById('passResetEmail').value);
      //send formdata using function from AJAX.js
      changePassword(formData);
    };

    document.getElementsByClassName('resetForm')[0].addEventListener('submit', (e) => { e.preventDefault(); onResetSubmit(); });
  }

  render() {
    return (
      <form className='resetForm' name='resetForm'>
      <div className='container-fluid'>
        <div className="row">
          <div className="col-12">
            <input type='text' id='passResetEmail' placeholder=' email ' required='required'/>
          </div>
          <div className="col-12">
            <button className='button resetButton btn-primary' id='resetButton'>Reset my password !</button>
          </div>
        </div>
      </div>
      </form>
    );
  }
}


