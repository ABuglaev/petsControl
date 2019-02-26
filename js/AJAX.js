import axios from 'axios';

  let signUp = function(formData){
    console.log('trying to signin...');
    axios({
      method: 'post',
      url: `http://tonight.by:3012/signup`,
      headers: { 'content-type': 'multipart/form-data' },
      data: formData,
    })
    .then(function (response) {
      console.log('Ok');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let logIn = function(formData){
    console.log('trying to login...');
    axios({
      method: 'post',
      url: `http://tonight.by:3012/login`,
      headers: { 'content-type': 'multipart/form-data' },
      data: formData,
    })
    .then(function (response) {
      console.log("Token from server : " + response.headers.authorization);
      localStorage.setItem('Token', response.headers.authorization);
      if (response.data.status) location.hash = 'main';
      alert(response.data.text);

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let getPets = (comp, token) => {
    axios({
      method: 'post',
      url: `http://tonight.by:3012/getTableData`,
      headers: {
        'content-type': 'application/json',
        'Authorization': localStorage.getItem('Token') || 'none',
      },
      data: { 'token': token },
    })
      .then((response) => {
        if (response.data.status == 0) { alert(response.data.text); location.hash = '#login'; return; }
        comp.setState({ petsRows: response.data });
      })
  }

  let  addPet = (formData) => {
    axios({
      method: 'post',
      url: `http://tonight.by:3012/addPet`,
      headers: { 'content-type': 'multipart/form-data',
                  'Authorization' : localStorage.getItem('Token') || 'none',
                  },
      data: formData,
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let  updatePet = function(formData) {
    console.log('trying to send update pet req...');
    axios({
      method: 'post',
      url: `http://tonight.by:3012/updatePet`,
      headers: { 'content-type': 'multipart/form-data',
                  'Authorization' : localStorage.getItem('Token') || 'none',
                  },
      data: formData,
    })
    .then(function (response) {
      console.log('Ok');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let  removePets = function(formData) {
    console.log('trying to send remove pets req...');
    axios({
      method: 'post',
      url: `http://tonight.by:3012/removePets`,
      headers: { 'content-type': 'multipart/form-data',
                  'Authorization' : localStorage.getItem('Token') || 'none',
                  },
      data: formData,
    })
    .then(function (response) {
      console.log('Ok');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  let changePassword = function(formData) {
    console.log('trying to reset password...');
    axios({
      method: 'post',
      url: `http://tonight.by:3012/resetPassword`,
      headers: { 'content-type': 'multipart/form-data' },
      data: formData,
    })
    .then(function (response) {
      console.log('Ok');
      console.log(response.headers)
      alert(response.data.text);
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  export {signUp, logIn, changePassword, getPets, addPet, removePets, updatePet};