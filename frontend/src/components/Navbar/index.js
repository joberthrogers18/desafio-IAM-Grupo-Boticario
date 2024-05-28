import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";

import "./styles.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRoute, setCurrenteRoute] = useState("");

  useEffect(() => {
    setCurrenteRoute(location.pathname);
  }, [location]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const start = (
    <div className="title-nav ">
      <i className="pi pi-list-check ml-2 mr-2"></i>
      OrganiZerando
    </div>
  );

  return (
    <div className="navbar">
      <Menubar
        start={start}
        visible={false}
        end={
          currentRoute === "/main" ? (
            <Button icon="pi pi-sign-out" onClick={() => logout()} />
          ) : null
        }
      />
    </div>
  );
}
