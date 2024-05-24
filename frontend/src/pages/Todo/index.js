import React, { useState } from "react";
import { Button } from "primereact/button";

import AlertInfo from "../../components/AlertInfo";
import ListTask from "../../components/ListTask";
import "./styles.css";
import CreationTask from "../../components/CreationTask";

function Todo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="todo-wrapper w-full flex justify-content-center align-items-center p-3">
      <div className="content-todo">
        <AlertInfo />
        <Button
          onClick={() => setVisible(true)}
          className="w-full mt-5 mb-5 flex justify-content-center"
        >
          <p className="btn-label m-0">Adicionar Tarefa</p>
          <i className="ml-3 pi pi-plus-circle"></i>
        </Button>
        <ListTask />
      </div>
      <CreationTask visible={visible} onChangeVisible={setVisible} />
    </div>
  );
}

export default Todo;
