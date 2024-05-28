import React from "react";
import Todo from "./pages/Todo";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";

function App() {
  return (
    <div className="w-full h-full">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Auth isLogin={true} />} />
          <Route exact path="/registrar" element={<Auth isLogin={false} />} />
          <Route exact path="/main" element={<Todo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
