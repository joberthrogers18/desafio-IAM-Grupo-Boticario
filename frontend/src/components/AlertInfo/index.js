import React from "react";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";

import "./styles.css";

function AlertInfo() {
  return (
    <div className="alert-info">
      <Card style={{ borderRadius: "30px" }}>
        <div className="flex flex-column">
          <div className="grid">
            <div className="col-7 flex flex-column justify-content-center align-items-center">
              <p className="title mb-2">Tarefas Concluídas</p>
              <p className="subtitle mt-0">Continue no foco e não desista!</p>
            </div>
            <div className="col-5 flex justify-content-center align-items-center">
              <div className="circle-progress flex justify-content-center align-items-center">
                1/3
              </div>
            </div>
          </div>

          <div>
            <p className="label-progress mt-1 mb-2">Seu progresso</p>
            <ProgressBar value={50}></ProgressBar>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AlertInfo;
