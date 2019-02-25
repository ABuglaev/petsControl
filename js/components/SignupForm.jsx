import './SignupForm.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {signUp, logIn} from '../AJAX.js';

export default class PostForm extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
    let onSignUpButtonClick = () =>{
      let formData = new FormData();
      formData.append('name',  document.getElementById('fullName').value);
      formData.append('age',  document.getElementById('age').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('password', document.getElementById('password').value);

      signUp(formData); //send formdata using function from AJAX.js

      //redirect to login page
      location.hash = '#login';
    }

    document.getElementsByClassName('signupForm')[0].addEventListener('submit', (e) => {e.preventDefault(); onSignUpButtonClick(); });
  }

  render() {
    return (
      <form className='signupForm' name='signupForm'>
        <div className='container-fluid'>
          <div className="row">
            <div className="col-12">
              <input type='text' id='fullName' placeholder=' your name' required='required' />
            </div>
            <div className="col-12">
              <input type='text' id='age' placeholder=' your age' required='required'/>
            </div>
            <div className="col-12">
              <input type='email' id='email' placeholder=' email' required='required'/>
            </div>
            <div className="col-12">
              <input type='password' id='password' placeholder=' password' required='required'/>
            </div>
            <div className="col-12">
              <button className='button signupButton btn-primary'   id='signupButton'  >Sign Up !</button>
            </div>
          </div>
        </div>
      </form>
      
    );
  }
}



