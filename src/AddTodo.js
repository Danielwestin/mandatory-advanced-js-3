import React from 'react';
import Linkify from 'react-linkify';
import MaterialIcon from 'material-icons-react';
import {deleteFadeOut} from './animations'


class AddTodo extends React.Component {
  constructor(props){
    super(props)

    this.deleteLiRef = React.createRef();
  }

  deleteLi = (id) => {
    deleteFadeOut(
      this.deleteLiRef.current,
      () => this.props.deleteTodo(id),
    )
  }

  render() {
    // onClick={() => this.props.deleteTodo(todo.id)}>

    return(
      <>
        <ul>
          {
            this.props.todo
            .map(todo => {
              return (
                <>
                <li
                  key={todo.id}
                  ref={this.deleteLiRef}>
                  <Linkify>{todo.content}</Linkify>
                  <button
                    className="delete-button"
                    onClick={() => this.deleteLi(todo.id)}>
                     <MaterialIcon icon="delete_forever"/>
                  </button>
                </li>
                </>
              )
            })
          }
        </ul>
      </>
    )
  }
}
export default AddTodo
