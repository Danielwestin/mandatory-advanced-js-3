import React from 'react';
import {token$, updateToken} from './store';
import {Helmet} from 'react-helmet-async';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import MaterialIcon from 'material-icons-react';
import {Redirect} from 'react-router-dom';
import AddTodo from './AddTodo'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.source = axios.CancelToken.source();

    this.state = {
      user: {},
      token: token$.value,
      content: '',
      todo: [],
    }
  }

  componentDidMount = () => {
    this.subscription = token$.subscribe(token => {
      this.setState({token});
    });
    this.setUser();
    this.getTodo();
  }

  componentWillUnmount = () => {
    this.subscription.unsubscribe();
    this.source.cancel();
  }

  deleteTodo = (id) => {
    axios.delete(`http://3.120.96.16:3002/todos/${id}`, {
      cancelToken: this.source.token,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      }
    })
      .then( response => {
        this.setState({todo: this.state.todo.filter(todo => todo.id !== id) })
      })
  }

  getTodo = () => {
    axios.get(`http://3.120.96.16:3002/todos`, {
      cancelToken: this.source.token,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      }
    })
    .then(response => {
      this.setState({todo: response.data.todos})
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        updateToken(null);
      }
    });
  }

  logout = () => {
    updateToken(null);
  }

  newTodo = (e) => {
    this.setState({content: e.target.value})
  }

  postTodo = (e) => {
    e.preventDefault();
    axios.post(`http://3.120.96.16:3002/todos`, { content: this.state.content}, {
      cancelToken: this.source.token,
      headers: {
              Authorization: `Bearer ${this.state.token}`,
          },
    })
    .then(response => {
      this.setState({todo: [...this.state.todo, response.data.todo]})
    })
    .then(() => {
      this.setState({content: ''})
    })
  }

  setUser = () => {
    const decoded = jwt.decode(token$.value);
    this.setState({user: decoded})
  }

  render() {
    if (!this.state.token) {
      return <Redirect to="/login" />
    }

    return(
      <>

        <Helmet>
          <title> TODOS </title>
        </Helmet>

        <div className="todo-page">
          <div className="todo-container">
            <button className="logout-button" onClick={this.logout}>
              &times;
            </button>
            <h1>Hello, {this.state.user.email}</h1>

            <form onSubmit={this.postTodo}>
              <label>Saker to do: </label>
              <input
                className="todo-input"
                type="text"
                value={this.state.content}
                onChange={this.newTodo}
              />
            <button className="add-todo-button" type="submit">
              <MaterialIcon icon="add" color="gray" size={15}/>
            </button>
            </form>

            <AddTodo
              todo={this.state.todo}
              deleteTodo={this.deleteTodo}
              />
          </div>
        </div>
      </>
    )
  }
}
export default Home
