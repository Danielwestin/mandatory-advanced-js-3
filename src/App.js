import React from 'react';
import './App.css';
import {HelmetProvider} from 'react-helmet-async';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';

class App extends React.Component  {

  render() {
    return (
      <>
        <HelmetProvider>
          <main>
            <Router>
              <Route path="/login" component={Login}/>
              <Route exact path="/" component={Home}/>
              <Route path="/register" component={Register}/>
            </Router>
          </main>
        </HelmetProvider>
      </>
    );
  }
}

export default App;
