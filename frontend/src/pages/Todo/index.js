import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";

import AlertInfo from "../../components/AlertInfo";
import ListTask from "../../components/ListTask";
import "./styles.css";
import CreationTask from "../../components/CreationTask";
import { TaskMapDto } from "../../dtos/TaskMapDto";
import axiosInstance from "../../config/axiosConfig";

function Todo() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [taskEdition, setTaskEdition] = useState(null);
  const toast = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [responseTask, responseLabels] = await Promise.all([
        axiosInstance.get(`/tarefa`),
        axiosInstance.get(`/etiquetas`),
      ]);

      setTasks(
        responseTask.data.data.map(
          (task) =>
            new TaskMapDto(
              task.id,
              task.titulo,
              task.descricao,
              task.estaCompleto,
              task.dataCriacao,
              task.dataModificacao,
              task.etiqueta.id,
              task.etiqueta.nome
            )
        )
      );

      setLabels(
        responseLabels.data.data.map((label) => ({
          name: label.nome,
          code: label.id,
        }))
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
      life: 6000,
    });
  }

  function enableEditionTask(itemTask) {
    setTaskEdition(itemTask);
    setVisible(true);
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
              setTaskEnableEdit={enableEditionTask}
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
              setTaskEnableEdit={enableEditionTask}
            />
          </TabPanel>
        </TabView>
      </div>
      <CreationTask
        visible={visible}
        onChangeVisible={setVisible}
        reloadData={fetchData}
        feedbackCreation={feedbackCreationTask}
        taskEdition={taskEdition}
        setTaskEdition={setTaskEdition}
        labels={labels}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default Todo;
