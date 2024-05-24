import React from "react";
import { Menubar } from "primereact/menubar";
import "./styles.css";

export default function Navbar() {
  const start = (
    <div className="title-nav ">
      <i className="pi pi-list-check ml-2 mr-2"></i>
      Organizerando
    </div>
  );

  return (
    <div className="navbar">
      <Menubar start={start} />
    </div>
  );
}
