import React from 'react';
import Linkify from 'react-linkify';
import MaterialIcon from 'material-icons-react';
import {deleteFadeOut} from './animations'


class AddTodo extends React.Component {

  deleteLi = (node, id) => {
    deleteFadeOut(
      node,
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
                <li
                  key={todo.id}>
                  <Linkify>{todo.content}</Linkify>
                  <button
                    className="delete-button"
                    onClick={(e) => this.deleteLi(e.target.parentElement.parentElement, todo.id)}>
                     <MaterialIcon icon="delete_forever"/>
                  </button>
                </li>
              )
            })
          }
        </ul>
      </>
    )
  }
}
export default AddTodo
