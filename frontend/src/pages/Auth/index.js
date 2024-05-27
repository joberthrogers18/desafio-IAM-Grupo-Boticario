import React from "react";

import "./styles.css";
import ImageAuth from "../../assets/illustration_auth.svg";
import Login from "../../components/Login";

export default function Auth() {
  return (
    <div className="auth grid">
      <div className="publicity col-7 flex justify-content-center align-items-center">
        <div className="content-wrapper">
          <img src={ImageAuth} alt="Ilustração mulher planejando" />
          <p className="mt-6 mb-0">
            Simplifique sua gestão com o <span>OrganiZerando</span>
          </p>
        </div>
      </div>
      <div className="col">
        <Login />
      </div>
    </div>
  );
}
