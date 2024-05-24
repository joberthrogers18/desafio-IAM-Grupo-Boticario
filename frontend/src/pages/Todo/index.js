import React from "react";
import { Button } from "primereact/button";

import AlertInfo from "../../components/AlertInfo";
import ListTask from "../../components/ListTask";
import "./styles.css";

function Todo() {
  return (
    <div className="todo-wrapper w-full flex justify-content-center align-items-center p-3">
      <div className="content-todo">
        <AlertInfo />
        <Button className="w-full mt-5 mb-5 flex justify-content-center">
          <p className="btn-label m-0">Adicionar Tarefa</p>
          <i className="ml-3 pi pi-plus-circle"></i>
        </Button>
        <ListTask />
      </div>
    </div>
  );
}

export default Todo;
