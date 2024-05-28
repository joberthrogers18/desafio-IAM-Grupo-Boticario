import React, { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Tag } from "primereact/tag";

import "./styles.css";
import { BodyUpdateTaskDto } from "../../dtos/BodyUpdateTaskDto";
import { StatusCode } from "../../constants/StatusCode";
import axiosInstance from "../../config/axiosConfig";

function renderScreenFinalRequisitionState(loading) {
  return loading ? (
    <div className="no-data-label">
      <Skeleton
        width="100%"
        height="150px"
        className="mb-3"
        borderRadius="15px"
      ></Skeleton>
      <Skeleton
        width="100%"
        height="150px"
        className="mb-3"
        borderRadius="15px"
      ></Skeleton>
      <Skeleton
        width="100%"
        height="150px"
        className="mb-3"
        borderRadius="15px"
      ></Skeleton>
    </div>
  ) : (
    <div className="no-data-label flex align-items-center justify-content-center">
      <p>Não há tarefas no momento</p>
    </div>
  );
}

function ListTask({
  tasks,
  loading,
  isTaskCompleted,
  reloadData,
  feedbackCreation,
  signLoadingData,
  setTaskEnableEdit,
  setSelectedFilter,
}) {
  const [filterTasks, setFilterTasks] = useState([]);

  useMemo(() => {
    setFilterTasks(tasks.filter((task) => task.isComplete === isTaskCompleted));
  }, [tasks, isTaskCompleted]);

  async function updateStateCompletionTask(task) {
    try {
      signLoadingData(true);
      const body = new BodyUpdateTaskDto(
        task.id,
        task.title,
        task.description,
        !task.isComplete,
        task.labelId
      );

      const response = await axiosInstance.put("/tarefa", body);

      if (
        "statusCode" in response &&
        response.statusCode === StatusCode.BAD_REQUEST
      ) {
        feedbackCreation("Error", response.message, "error");
        return;
      }

      feedbackCreation("Sucesso", "Tarefa atualizada com sucesso", "success");
      reloadData();
    } catch (e) {
      console.log("Error in create task: ", e);
      feedbackCreation(
        "Erro",
        "Nao foi possível atualizar a tarefa. Tente novamente mais tarde",
        "error"
      );
    } finally {
      signLoadingData(false);
      setSelectedFilter(null);
    }
  }

  async function removeTask(id) {
    try {
      signLoadingData(true);

      await axiosInstance.delete(`/tarefa/${id}`);

      feedbackCreation("Sucesso", "Tarefa deletada com sucesso", "success");
      reloadData();
    } catch (e) {
      console.log("Error in create task: ", e);
      feedbackCreation(
        "Erro",
        "Nao foi possível deletar a tarefa. Tente novamente mais tarde",
        "error"
      );
    } finally {
      signLoadingData(false);
      setSelectedFilter(null);
    }
  }

  function askForDelete(event, id) {
    confirmPopup({
      target: event.currentTarget,
      acceptLabel: "Sim",
      rejectLabel: "No",
      message:
        "Você tem certeza que deseja apagar essa tarefa? Ela não poderá ser recuperada!",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        removeTask(id);
      },
      reject: null,
    });
  }

  function getSeverity(priority) {
    switch (priority) {
      case "Alta":
        return "danger";

      case "Media":
        return "warning";

      default:
        return "success";
    }
  }

  return (
    <div className="list-task flex justify-content-center flex-column">
      {!loading && filterTasks && filterTasks.length > 0
        ? filterTasks.map((taskItem) => (
            <Card className="mb-3" key={taskItem.id}>
              <div className="content grid">
                <div className="text-content col-12 md:col-10">
                  <div className="mb-2 flex align-items-center">
                    <span className="title-task">{taskItem.title}</span>{" "}
                    <Button
                      icon="pi pi-file-edit"
                      rounded
                      text
                      severity="secondary"
                      aria-label="Editar"
                      className="ml-2"
                      tooltip="Editar"
                      tooltipOptions={{ position: "top" }}
                      onClick={() => setTaskEnableEdit(taskItem)}
                    />
                  </div>
                  <div className="label mb-3">
                    <span className="label-priority">Prioridade:</span>{" "}
                    <Tag
                      severity={getSeverity(taskItem.nameLabel)}
                      value={taskItem.nameLabel}
                    ></Tag>
                  </div>
                  <div className="description-task">
                    <span className="label-priority">Descrição:</span>{" "}
                    {taskItem.description}
                  </div>
                </div>
                <div className="content-action col-12 md:col-2 flex flex-column flex-wrap align-items-end">
                  {isTaskCompleted && (
                    <Button
                      icon="pi pi-replay"
                      severity="primary"
                      aria-label="Completar"
                      className="mb-2 w-full md:w-7"
                      tooltip="Retornar"
                      tooltipOptions={{ position: "right" }}
                      disabled={loading}
                      onClick={() => updateStateCompletionTask(taskItem)}
                    />
                  )}
                  {!isTaskCompleted && (
                    <Button
                      icon="pi pi-check"
                      severity="success"
                      aria-label="Completar"
                      className="mb-2 w-full md:w-7"
                      tooltip="Marcar como completa"
                      tooltipOptions={{ position: "right" }}
                      disabled={loading}
                      onClick={() => updateStateCompletionTask(taskItem)}
                    />
                  )}

                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    aria-label="Remover"
                    className="w-full md:w-7"
                    tooltip="Remover"
                    disabled={loading}
                    tooltipOptions={{ position: "right" }}
                    onClick={(e) => askForDelete(e, taskItem.id)}
                  />
                </div>
              </div>
            </Card>
          ))
        : renderScreenFinalRequisitionState(loading)}
      <ConfirmPopup />
    </div>
  );
}

export default ListTask;
