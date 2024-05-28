import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";

export default function Filter({
  visible,
  setVisible,
  labels,
  setSelectedFilter,
  selectedFilter,
}) {
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    if (visible) {
      setFilter(selectedFilter);
    }
  }, [visible]);

  function hideDialog(visible) {
    if (!visible) return;
    setVisible(false);
    setSelectedFilter(null);
  }

  function handleClickSave() {
    setSelectedFilter(filter);
    setVisible(false);
  }

  return (
    <div className="filter">
      <Dialog
        header="Filtrar por"
        visible={visible}
        style={{ width: "500px" }}
        onHide={() => hideDialog(visible)}
      >
        <div className="card flex flex-column mb-4">
          <label className="mb-2 label-dialog">Prioridade</label>
          <Dropdown
            value={filter}
            onChange={(e) => setFilter(e.value)}
            options={[{ code: null, name: "Todos" }, ...labels]}
            optionLabel="name"
            placeholder="Selecione uma prioridade"
            className="w-full"
          />
        </div>
        <Button
          label="Salvar"
          className="w-full"
          onClick={() => handleClickSave()}
        />
      </Dialog>
    </div>
  );
}
