import React, { useMemo, useState } from "react";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { Skeleton } from "primereact/skeleton";

import "./styles.css";

function AlertInfo({ tasks, loading }) {
  const [numberCompleted, setNumberCompleted] = useState(0);
  const [numberTotal, setNumberTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.isComplete).length;
    setNumberTotal(total);
    setNumberCompleted(completed);
    setPercentage(Math.round((completed / total) * 100) || 0);
  }, [tasks]);

  return (
    <div className="alert-info">
      <Card style={{ borderRadius: "30px" }}>
        <div className="flex flex-column">
          <div className="grid">
            <div className="col-12 md:col-7 flex flex-column justify-content-center align-items-center">
              <p className="title mb-2">Tarefas Concluídas</p>
              <p className="subtitle mt-0">Continue no foco e não desista!</p>
            </div>
            <div className="col-12 md:col-5 flex justify-content-center align-items-center">
              {loading ? (
                <Skeleton
                  width="120px"
                  height="120px"
                  className="mb-3"
                  borderRadius="50%"
                ></Skeleton>
              ) : (
                <div className="circle-progress flex justify-content-center align-items-center">
                  {numberCompleted} / {numberTotal}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="label-progress mt-1 mb-2">Seu progresso</p>
            {loading ? (
              <Skeleton
                width="100%"
                height="24px"
                borderRadius="5px"
              ></Skeleton>
            ) : (
              <ProgressBar value={percentage}></ProgressBar>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AlertInfo;
