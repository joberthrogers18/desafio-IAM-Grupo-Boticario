import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

import "./styles.css";
import { HttpStatusCode } from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/usuario/login", {
        email,
        senha: password,
      });

      console.log("token", response);

      localStorage.setItem("token", response.data.data.token);

      navigate("/main");
    } catch (error) {
      console.log(error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail:
            error.response.data.data &&
            error.response.data.data.StatusCode === HttpStatusCode.BadRequest
              ? error.response.data.data.message
              : "Não foi possível logar tente novamente mais tarde",
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="login h-full flex justify-content-center align-items-center">
      <Toast ref={toast} />
      <div className="login-wrapper flex flex-column justify-content-between">
        <div className="w-full flex justify-content-center title">
          <p className="m-0 text-2xl">Login</p>
        </div>
        <div className="input-wrapper w-full flex justify-content-center flex-column">
          <label className="mb-3">Email</label>
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-wrapper w-full flex justify-content-center flex-column">
          <label className="mb-3">Senha</label>
          <Password
            className="w-full"
            disabled={loading}
            value={password}
            feedback={false}
            toggleMask
            tabIndex={1}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          disabled={loading || !email || !password}
          label="Entrar"
          className="w-full"
          loading={loading}
          onClick={() => handleSubmit()}
        />

        <div className="hyperlink flex justify-content-center">
          <a href="/registrar">Registre-se</a>
        </div>
      </div>
    </div>
  );
}
