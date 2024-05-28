import React, { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

import "./styles.css";
import { BodyUpdateTaskDto } from "../../dtos/BodyUpdateTaskDto";
import { StatusCode } from "../../constants/StatusCode";
import { BodyPostTaskDto } from "../../dtos/BodyPostTaskDto";
import axiosInstance from "../../config/axiosConfig";

function CreationTask({
  visible,
  onChangeVisible,
  reloadData,
  feedbackCreation,
  taskEdition,
  setTaskEdition,
  labels,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [loadingCreation, setLoadingCreation] = useState("");

  useMemo(() => {
    setTitle((taskEdition && taskEdition.title) || "");
    setDescription((taskEdition && taskEdition.description) || "");
    setSelectedPriority(
      taskEdition && { code: taskEdition.labelId, name: taskEdition.nameLabel }
    );
  }, [taskEdition]);

  function cleanFields() {
    setTitle("");
    setDescription("");
    setSelectedPriority(null);
  }

  async function handleTask(taskEdition) {
    if (taskEdition) {
      requestEditTask(taskEdition);
    } else {
      requestCreateTask();
    }
  }

  async function requestCreateTask() {
    try {
      setLoadingCreation(true);
      const body = new BodyPostTaskDto(
        title,
        description,
        false,
        selectedPriority.code || 1
      );

      const response = await axiosInstance.post(`/tarefa`, body);

      feedbackCreation("Sucesso", response.data.message, "success");
      cleanFields();
      onChangeVisible(false);
      reloadData();
    } catch (e) {
      console.log("Error in create task: ", e);
      feedbackCreation(
        "Erro",
        "Nao foi possível criar a tarefa. Tente novamente mais tarde",
        "error"
      );
    } finally {
      setLoadingCreation(false);
    }
  }

  async function requestEditTask(task) {
    try {
      setLoadingCreation(true);
      const body = new BodyUpdateTaskDto(
        task.id,
        title,
        description,
        task.isComplete,
        selectedPriority.code || 1
      );

      const response = await axiosInstance.put("/tarefa", body);

      if (
        "statusCode" in response &&
        response.data.statusCode === StatusCode.BAD_REQUEST
      ) {
        feedbackCreation("Error", response.data.message, "error");
        return;
      }

      feedbackCreation("Sucesso", response.data.message, "success");
      setTaskEdition(null);
      cleanFields();
      onChangeVisible(false);
      reloadData();
    } catch (e) {
      console.log("Error in update task: ", e);
      feedbackCreation(
        "Erro",
        "Nao foi possível atualizar a tarefa. Tente novamente mais tarde",
        "error"
      );
    } finally {
      setLoadingCreation(false);
    }
  }

  return (
    <div className="create-task">
      <Dialog
        header={taskEdition ? "Editar Tarefa" : "Criar Tarefa"}
        visible={visible}
        style={{ width: "500px" }}
        onHide={() => {
          if (!visible) return;
          setTitle("");
          setDescription("");
          setTaskEdition(null);
          onChangeVisible(false);
        }}
      >
        <div className="card flex flex-column mb-4">
          <label className="mb-2 label-dialog">Título</label>
          <InputText
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="card flex flex-column mb-4">
          <label className="mb-2 label-dialog">Prioridade</label>
          <Dropdown
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.value)}
            options={labels}
            optionLabel="name"
            placeholder="Selecione uma prioridade"
            className="w-full"
          />
        </div>
        <div className="card flex flex-column mb-4">
          <label className="mb-2 label-dialog">Descrição</label>
          <InputTextarea
            autoResize
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            cols={30}
            className="w-full"
          />
        </div>
        <Button
          label="Salvar"
          className="w-full"
          loading={loadingCreation}
          disabled={title === "" || description === ""}
          onClick={() => handleTask(taskEdition)}
        />
      </Dialog>
    </div>
  );
}

export default CreationTask;
