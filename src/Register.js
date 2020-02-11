import React from 'react';
import {Helmet} from 'react-helmet-async';
import {Route, BrowserRouter as Router, Redirect, Link} from 'react-router-dom';
import {token$, updateToken} from './store';
import MaterialIcon from 'material-icons-react';
import axios from 'axios';
import './Css/Register.css';
import {slide, fadeIn} from './animations';

class Register extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: {
        email: '',
        password: '',
      },
      redirect: false,
      redirectToLogin: false,
      existingUser: false,
      token: token$.value,
    }

    this.frontRef = React.createRef();
    this.behindRef = React.createRef();
    this.registerFormRef = React.createRef();
    this.titleRef = React.createRef();
  }

  componentDidMount = () => {
    this.subscription = token$.subscribe(token => {
      this.setState({token});
    });
    this.initFadeIn();
  }

  componentWillUnmount = () => {
    this.subscription.unsubscribe();
  }

  goToLogin = () => {
    slide(
      "right",
      this.frontRef.current,
      this.behindRef.current,
      () => this.setState({redirectToLogin: true})
    );
  }

  initFadeIn = () => {
    fadeIn(
      this.titleRef.current,
      this.registerFormRef.current,
    )
  }

  onChange = (e) => {
    this.setState({
      existingUser: false,
      user: {...this.state.user, [e.target.name]: e.target.value}
    })
  }

  register = (e) => {
    e.preventDefault();
    axios.post(`http://3.120.96.16:3002/register`, this.state.user)
      .then(response => {
        return axios.post(`http://3.120.96.16:3002/auth`, this.state.user)
      })
      .then (response => {
        console.log(response.data.token);
        updateToken(response.data.token);
      })
      .then(() => {
        this.setState({redirect: true})
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          this.setState({existingUser: true})
        }
      })
    }


  render() {

    if (this.state.redirectToLogin){
      return <Redirect to="/login"/>
    }

    let exists;
    if (this.state.existingUser){
    exists =  <p> Användaren finns redan </p>
    } else{
    exists = null
    }

    if (this.state.redirect || this.state.token) {
      return <Redirect to="/"/>
    }
    return(
      <>

      <Helmet>
        <title> Register </title>
      </Helmet>

        <div className="container">

          <div ref={this.behindRef} className="left-container-register-behind">
            <div ref={this.frontRef} className="left-container-register-front">
              <div onClick={this.goToLogin} ref={this.titleRef} className="login">
                <h1>Already have an account?</h1>
                <p>Click Here!</p>
              </div>
            </div>
          </div>

          <div className="right-container-register" ref={this.registerFormRef}>
            <h1> Sign Up! </h1>

            <form onSubmit={this.register}>

              <div className="register-input">
                <MaterialIcon icon="account_circle" color="#black"/>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={this.onChange}
                  value={this.state.user.email}
                />
              </div>


              <div className="register-input">
                <MaterialIcon icon="lock" color="#black"/>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.onChange}
                  value={this.state.user.password}
                />
              </div>

            <button type="submit">Create User</button>
          </form>

          <div className="existing-user">
          {exists}
          </div>
        </div>

        </div>
      </>
    );
  }
}
export default Register
