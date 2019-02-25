import React from 'react';
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';
import Table from './Table.jsx';
import PasswordResetForm from './PasswordResetForm.jsx';


location.hash = '#main';

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      componentToDisplay: location.hash,
    }
    
  }
  
  componentDidMount() {
    window.addEventListener('hashchange', () => { this.setState({componentToDisplay: location.hash}) });
    
  }

  render() {
    switch (this.state.componentToDisplay) {
      case '#login':
        return <LoginForm />
        break;
      case '#signup':
        return <SignupForm />
        break;
      case '#main':
        return <Table />
        break;
      case '#passwordReset':
        return <PasswordResetForm />
        break;
    }
  }
}