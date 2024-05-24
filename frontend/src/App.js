import React from "react";
import Todo from "./pages/Todo";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="w-full">
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/" element={<Todo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
