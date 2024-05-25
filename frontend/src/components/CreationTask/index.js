import React, { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import "./styles.css";

function CreationTask({
  visible,
  onChangeVisible,
  reloadData,
  feedbackCreation,
  taskEdition,
  setTaskEdition,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingCreation, setLoadingCreation] = useState("");

  useMemo(() => {
    setTitle((taskEdition && taskEdition.title) || "");
    setDescription((taskEdition && taskEdition.description) || "");
  }, [taskEdition]);

  function cleanFields() {
    setTitle("");
    setDescription("");
  }

  async function requestCreateTask() {
    try {
      setLoadingCreation(true);
      const body = {
        titulo: title,
        descricao: description,
        estaCompleto: false,
      };

      const response = await fetch("http://localhost:3000/tarefa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseParseJson = await response.json();

      feedbackCreation("Sucesso", responseParseJson.message, "success");
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
      const body = {
        id: task.id,
        tarefa: {
          titulo: title,
          descricao: description,
          estaCompleto: task.isComplete,
        },
      };

      const response = await fetch("http://localhost:3000/tarefa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseParseJson = await response.json();

      feedbackCreation("Sucesso", responseParseJson.message, "success");
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
          onClick={() =>
            taskEdition ? requestEditTask(taskEdition) : requestCreateTask()
          }
        />
      </Dialog>
    </div>
  );
}

export default CreationTask;
