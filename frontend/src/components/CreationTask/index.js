import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import "./styles.css";

function CreationTask({ visible, onChangeVisible }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="create-task">
      <Dialog
        header="Criar tarefa"
        visible={visible}
        style={{ width: "500px" }}
        onHide={() => {
          if (!visible) return;
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
          disabled={title === "" || description === ""}
        />
      </Dialog>
    </div>
  );
}

export default CreationTask;
