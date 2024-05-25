import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";

import AlertInfo from "../../components/AlertInfo";
import ListTask from "../../components/ListTask";
import "./styles.css";
import CreationTask from "../../components/CreationTask";
import { TaskMapDto } from "../../dtos/TaskMapDto";

function Todo() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const toast = useRef(null);

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function feedbackCreationTask(title, message, severity) {
    toast.current.show({
      severity,
      summary: title,
      detail: message,
    });
  }

  return (
    <div className="todo-wrapper w-full flex justify-content-center align-items-center p-3">
      <div className="content-todo">
        <AlertInfo tasks={tasks} loading={loading} />
        <Button
          disabled={loading}
          onClick={() => setVisible(true)}
          className="w-full mt-3 flex justify-content-center"
        >
          <p className="btn-label m-0">Adicionar Tarefa</p>
          <i className="ml-3 pi pi-list"></i>
        </Button>
        <TabView className="tab-view mt-2">
          <TabPanel header="Pendentes" leftIcon="pi pi-calendar mr-2">
            <ListTask
              tasks={tasks}
              loading={loading}
              isTaskCompleted={false}
              reloadData={fetchData}
              feedbackCreation={feedbackCreationTask}
              signLoadingData={setLoading}
            />
          </TabPanel>
          <TabPanel header="Concluídas" leftIcon="pi pi-list-check mr-2">
            <ListTask
              tasks={tasks}
              loading={loading}
              isTaskCompleted={true}
              reloadData={fetchData}
              feedbackCreation={feedbackCreationTask}
              signLoadingData={setLoading}
            />
          </TabPanel>
        </TabView>
      </div>
      <CreationTask
        visible={visible}
        onChangeVisible={setVisible}
        reloadData={fetchData}
        feedbackCreation={feedbackCreationTask}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default Todo;
