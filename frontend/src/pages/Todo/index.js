import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import AlertInfo from "../../components/AlertInfo";
import ListTask from "../../components/ListTask";
import "./styles.css";
import CreationTask from "../../components/CreationTask";
import { TaskMapDto } from "../../dtos/TaskMapDto";

function Todo() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/tarefa");
        const responseJson = await response.json();

        setTasks(
          responseJson.data.map(
            (task) =>
              new TaskMapDto(
                task.id,
                task.titulo,
                task.descricao,
                task.estaCompleto,
                task.dataCriacao,
                task.dataModificacao
              )
          )
        );
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro ao carregar dados",
          detail:
            "Não possível carregar os dados das tarefas. Tente novamente mais tarde!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="todo-wrapper w-full flex justify-content-center align-items-center p-3">
      <div className="content-todo">
        <AlertInfo />
        <Button
          disabled={loading}
          onClick={() => setVisible(true)}
          className="w-full mt-5 mb-5 flex justify-content-center"
        >
          <p className="btn-label m-0">Adicionar Tarefa</p>
          <i className="ml-3 pi pi-plus-circle"></i>
        </Button>
        <ListTask tasks={tasks} loading={loading} isTaskCompleted={false} />
      </div>
      <CreationTask visible={visible} onChangeVisible={setVisible} />
      <Toast ref={toast} />
    </div>
  );
}

export default Todo;
