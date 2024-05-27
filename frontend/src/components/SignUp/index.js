import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

import "./styles.css";
import { HttpStatusCode } from "axios";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);

    try {
      await axiosInstance.post("/usuario", {
        email,
        usuario: username,
        senha: password,
      });

      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Conta criada com sucesso",
      });

      setEmail("");
      setUsername("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
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
          <p className="m-0 text-2xl">Registre-se</p>
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
          <label className="mb-3">Usuario</label>
          <InputText
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-wrapper w-full flex justify-content-center flex-column">
          <label className="mb-3">Senha</label>
          <Password
            className="w-full"
            disabled={loading}
            value={password}
            feedback={true}
            toggleMask
            tabIndex={1}
            promptLabel="Escolha uma senha"
            weakLabel="Muito simples"
            mediumLabel="Mediana"
            strongLabel="Senha complexa"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          disabled={loading || !email || !password || !username}
          label="Criar"
          className="w-full"
          loading={loading}
          onClick={() => handleSubmit()}
        />

        <div className="hyperlink flex justify-content-center">
          <a href="/">Ja tenho conta</a>
        </div>
      </div>
    </div>
  );
}
