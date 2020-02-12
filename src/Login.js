import React from 'react';
import {Helmet} from 'react-helmet-async';
import {Redirect} from 'react-router-dom';
import {token$, updateToken} from './store';
import axios from 'axios';
import MaterialIcon from 'material-icons-react';
import './Css/Login.css'
import {slide, fadeIn} from './animations'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.source = axios.CancelToken.source();

    this.state = {
      user: {
        email: '',
        password: '',
        token: token$.value,
      },
      redirect: false,
      redirectToRegister: false,
      loginError: false,
    }

    this.frontRef = React.createRef();
    this.behindRef = React.createRef();
    this.titleRef = React.createRef();
    this.loginFormRef = React.createRef();
  }

  componentDidMount = () => {
    this.subscription = token$.subscribe(token => {
      this.setState({token});
    });
    this.initFadeIn();
  }

  componentWillUnmount = () => {
    this.subscription.unsubscribe();
    this.source.cancel();
  }

  goToRegister = () => {
    slide(
      "left",
      this.frontRef.current,
      this.behindRef.current,
      () => this.setState({redirectToRegister: true})
    );
  }

  initFadeIn = () => {
    fadeIn(
      this.titleRef.current,
      this.loginFormRef.current,
    )
  }

  onChange = (e) => {
    this.setState({user: {...this.state.user, [e.target.name]: e.target.value}})
  }

  onSubmit = (e) => {
    e.preventDefault();
    let authData = {
      email: this.state.user.email,
      password: this.state.user.password,
    };
    axios.post(`http://3.120.96.16:3002/auth`, authData, {
      cancelToken: this.source.token,
    })
      .then(response => {
        updateToken(response.data.token)

      })
      .then(() => {
        this.setState({redirect: true,})
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          this.setState({loginError: true})
        }
      })
  }

  render() {

    if (this.state.redirectToRegister){
      return <Redirect to="/register"/>
    }

    if (this.state.redirect || this.state.token){
      return <Redirect to="/" />
    }

    let error;
    if (this.state.loginError){
    error =  <p> Wrong username or password </p>
    } else{
    error = null
    }

    return(
      <>

        <Helmet>
          <title> Logga in </title>
        </Helmet>
        <div className="container">

          <div ref={this.loginFormRef} className="left-container">
            <h1> Sign in! </h1>
            <form onSubmit={this.onSubmit}>

              <div className="login-input">
                <MaterialIcon icon="account_circle" color="#black"/>
                <input
                  name="email"
                  type="email"
                  id="email-id"
                  placeholder="Username"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>

              <br/>

              <div className="login-input">
                <MaterialIcon icon="lock" color="#black"/>
                <input
                  name="password"
                  type="password"
                  id="password-id"
                  placeholder="Password"
                  autoComplete="off"
                  value={this.state.password}
                  onChange={this.onChange}
                />
            </div>


              <button type="submit"> Login </button>
            </form>
            <div className="login-error">
            {error}
            </div>
          </div>


          <div ref={this.behindRef} className="rigth-container-behind">
            <div ref={this.frontRef} className="right-container-front">
              <div ref={this.titleRef} className="registrera" onClick={this.goToRegister}>
                <h1>Hello</h1>
                <p>Click here to create a user</p>
                <p>Sign up!</p>
              </div>
            </div>
          </div>

        </div>
      </>
    )
  }
}
export default Home
