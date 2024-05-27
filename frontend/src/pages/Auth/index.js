import React from "react";

import "./styles.css";
import ImageAuth from "../../assets/illustration_auth.svg";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";

export default function Auth({ isLogin }) {
  return (
    <div className="auth grid">
      <div className="hidden publicity col-7 lg:flex justify-content-center align-items-center">
        <div className="content-wrapper">
          <img src={ImageAuth} alt="Ilustração mulher planejando" />
          <p className="mt-6 mb-0">
            Simplifique sua gestão com o <span>OrganiZerando</span>
          </p>
        </div>
      </div>
      <div className="col">{isLogin ? <Login /> : <SignUp />}</div>
    </div>
  );
}
