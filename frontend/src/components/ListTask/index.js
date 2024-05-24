import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import "./styles.css";

function ListTask() {
  return (
    <div className="list-task">
      <Card className="mb-3">
        <div className="content grid">
          <div className="text-content col-12 md:col-10">
            <div className="mb-2 flex align-items-center">
              <span className="title-task">Titulo</span>{" "}
              <Button
                icon="pi pi-file-edit"
                rounded
                text
                severity="secondary"
                aria-label="Editar"
                className="ml-2"
                tooltip="Editar"
                tooltipOptions={{ position: "top" }}
              />
            </div>
            <div className="description-task">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Inventore sed consequuntur error repudiandae numquam deserunt.
            </div>
          </div>
          <div className="content-action col-12 md:col-2 flex flex-column flex-wrap align-items-end">
            <Button
              icon="pi pi-check"
              severity="success"
              aria-label="Completar"
              className="mb-2 w-full md:w-7"
              tooltip="Marcar como completa"
              tooltipOptions={{ position: "right" }}
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              aria-label="Remover"
              className="w-full md:w-7"
              tooltip="Remover"
              tooltipOptions={{ position: "right" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListTask;
