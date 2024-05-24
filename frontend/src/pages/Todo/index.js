import React from "react";
import AlertInfo from "../../components/AlertInfo";

import "./styles.css";

function Todo() {
  return (
    <div className="todo-wrapper w-full flex justify-content-center align-items-center p-3">
      <div className="content-todo">
        <AlertInfo />
      </div>
    </div>
  );
}

export default Todo;
