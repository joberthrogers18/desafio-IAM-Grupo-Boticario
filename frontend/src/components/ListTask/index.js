import React, { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

import "./styles.css";

function renderListByData(tasks, isTaskCompleted) {
  return tasks && tasks.length > 0 ? (
    tasks.map((task) => (
      <Card className="mb-3" key={task.id}>
        <div className="content grid">
          <div className="text-content col-12 md:col-10">
            <div className="mb-2 flex align-items-center">
              <span className="title-task">{task.title}</span>{" "}
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
            <div className="description-task">{task.description}</div>
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
              />
            )}

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
    ))
  ) : (
    <div className="no-data-label flex align-items-center justify-content-center">
      <p>Não há tarefas no momento</p>
    </div>
  );
}

function ListTask({ tasks, loading, isTaskCompleted }) {
  const [filterTasks, setFilterTasks] = useState([]);

  useMemo(() => {
    setFilterTasks(tasks.filter((task) => task.isComplete === isTaskCompleted));
  }, [tasks]);

  return (
    <div className="list-task flex justify-content-center flex-column">
      {loading ? (
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
        renderListByData(filterTasks, isTaskCompleted)
      )}
    </div>
  );
}

export default ListTask;
