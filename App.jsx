import React, { Component } from 'react';
import './App.css';
import { callApi, setSession } from './api'; // Make sure these are defined

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showSignin: true,
      fullname: '',
      emailid: '',
      password: '',
      confirmpassword: '',
      username: '',
      errorMessage: '',
      successMessage: '',
      errors: {},
      forgotEmail: '',
    };
  }

  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup,
      errorMessage: '',
      successMessage: '',
      errors: {}
    });
  };

  switchToSignup = () => {
    this.setState({
      showSignin: false,
      showPopup: true,
      errorMessage: '',
      successMessage: '',
      errors: {}
    });
  };

  switchToSignin = () => {
    this.setState({
      showSignin: true,
      errorMessage: '',
      successMessage: '',
      errors: {}
    });
  };

  closePopup = (event) => {
    if (event.target.id === "popup") {
      this.togglePopup();
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      [name]: value,
      errors: { ...prevState.errors, [name]: false },
      errorMessage: '',
      successMessage: ''
    }));
  };

  handleSignIn = () => {
    const { username, password } = this.state;
    let errors = {};
    if (!username) errors.username = true;
    if (!password) errors.password = true;

    if (Object.keys(errors).length > 0) {
      this.setState({ errors, errorMessage: "Please fill in all fields." });
      return;
    }

    const data = { emailid: username, password };

    callApi("POST", "user/signin", data, (responseData) => {
      if (responseData.status === 'error') {
        this.setState({ errorMessage: responseData.message, successMessage: '' });
      } else if (responseData.token) {
        setSession("authToken", responseData.token, 1);
        this.setState({
          username: '',
          password: '',
          errorMessage: '',
          successMessage: 'Signed in successfully!',
          errors: {}
        });
        setTimeout(() => this.togglePopup(), 1000);
      } else {
        this.setState({ errorMessage: responseData.message || "Login failed." });
      }
    });
  };

  handleSignUp = () => {
    const { fullname, emailid, password, confirmpassword } = this.state;
    let errors = {};

    if (!fullname) errors.fullname = true;
    if (!emailid) errors.emailid = true;
    if (!password) errors.password = true;
    if (!confirmpassword) errors.confirmpassword = true;

    if (Object.keys(errors).length > 0) {
      this.setState({ errors, errorMessage: "All fields are required." });
      return;
    }

    if (!emailid.endsWith('@gmail.com')) {
      this.setState({ errors: { emailid: true }, errorMessage: "Email must be a Gmail address (e.g., example@gmail.com)." });
      return;
    }

    if (password !== confirmpassword) {
      this.setState({ errors: { password: true, confirmpassword: true }, errorMessage: "Passwords do not match!" });
      return;
    }

    const data = { fullname, emailid, password };
    callApi("POST", "user/signup", data, this.signupResponse);
  };

  signupResponse = (response) => {
    if (response.status === 'error') {
      if (response.message && response.message.toLowerCase().includes('email')) {
        this.setState({ errorMessage: 'Email ID already exists', errors: { emailid: true } });
      } else {
        this.setState({ errorMessage: response.message || 'Signup failed' });
      }
    } else if (response.status === 'success') {
      this.setState({
        fullname: '',
        emailid: '',
        password: '',
        confirmpassword: '',
        showSignin: true,
        errorMessage: '',
        successMessage: response.message || 'Signup successful!',
        errors: {}
      });
    }
  };

  forgotPassword = () => {
    const { username } = this.state;
    if (!username) {
      this.setState({ errors: { username: true }, errorMessage: "Please enter your email to reset password." });
      return;
    }

    const data = { emailid: username };

    callApi("POST", "user/forgotpassword", data, this.forgotPasswordResponse);
  };
  

  forgotPasswordResponse = (response) => {
    const parts = response.split("::");
    const status = parts[0];
    const message = parts[1];

    if (status === "200") {
      this.setState({ successMessage: message, errorMessage: '' });
    } else {
      this.setState({ errorMessage: message, successMessage: '' });
    }
  };

  render() {
    const { showPopup, showSignin, errorMessage, successMessage, errors } = this.state;

    const getInputClass = (field) => errors[field] ? 'input-error' : '';

    return (
      <div id='container'>
        {showPopup && (
          <div id='popup' onClick={this.closePopup}>
            <div id='popupWindow'>
              {showSignin ? (
                <div id='signinpage'>
                  <div className='signinTitle'>Login</div>
                  <div className='signindiv'>
                    <label>Username*</label>
                    <input
                      type='text'
                      name='username'
                      className={getInputClass('username')}
                      value={this.state.username}
                      onChange={this.handleInputChange}
                      placeholder='Enter Username'
                    />
                    <label>Password*</label>
                    <input
                      type='password'
                      name='password'
                      className={getInputClass('password')}
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      placeholder='Enter Password'
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <div className='forgotpassworddiv'>
                      <span>Forgot </span>
                      <span className='forgotpasswordlabel' onClick={this.forgotPassword}>Password?</span>
                    </div>
                    <button onClick={this.handleSignIn}>Sign In</button>
                    <div className='createaccount'>
                      <span>Don't have an account? </span>
                      <span className='signupnowlabel' onClick={this.switchToSignup}>SIGN UP NOW</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div id='signuppage'>
                  <div className='signupTitle'>Create New Account</div>
                  <div className='signupdiv'>
                    <label>Full Name*</label>
                    <input
                      type='text'
                      name='fullname'
                      className={getInputClass('fullname')}
                      value={this.state.fullname}
                      onChange={this.handleInputChange}
                      placeholder='Enter Full Name'
                    />
                    <label>Email ID*</label>
                    <input
                      type='email'
                      name='emailid'
                      className={getInputClass('emailid')}
                      value={this.state.emailid}
                      onChange={this.handleInputChange}
                      placeholder='Enter Email'
                    />
                    <label>Password*</label>
                    <input
                      type='password'
                      name='password'
                      className={getInputClass('password')}
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      placeholder='Enter Password'
                    />
                    <label>Confirm Password*</label>
                    <input
                      type='password'
                      name='confirmpassword'
                      className={getInputClass('confirmpassword')}
                      value={this.state.confirmpassword}
                      onChange={this.handleInputChange}
                      placeholder='Confirm Password'
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <button onClick={this.handleSignUp}>Register</button>
                    <div className='signinnavigation'>
                      <span>Already have an account? </span>
                      <span className='signinspan' onClick={this.switchToSignin}>SIGN IN</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div id='header'>
          <img className='logo' src='/logo.png' alt='Logo' />
          <div className='site-title'>Delicious <span>Recipes</span></div>
          <div className='auth'>
            <img className='signin' onClick={this.togglePopup} src='/user.png' alt='Sign In' />
            <label onClick={this.togglePopup}>Sign In</label>
          </div>
        </div>

        <div id='content'>
          <div className='hero'>
            <label className='text1'>INDIA'S #1 RECIPE PLATFORM</label>
            <label className='text2'>Your recipe search ends here</label>
            <label className='text3'>Discover delicious recipes</label>

            <div className='search-section'>
              <input type='text' className='searchBySkill' placeholder='Search recipe by "name"' />
              <input type='text' className='searchByLocation' placeholder='Recipe Location' />
              <button>Search recipes</button>
            </div>
          </div>
        </div>

        <section className="featured-recipes">
          <h2>Featured Recipes</h2>
          <div className="recipe-grid">
            <div className="recipe" onClick={this.handleRecipeClick}>
              <img src='/dish-1.jpg' alt='Recipe 1' />
              <h3>Recipe Sample</h3>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
