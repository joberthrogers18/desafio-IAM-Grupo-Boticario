import React from "react";
import Todo from "./pages/Todo";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="w-full">
      <Router>
        <Routes>
          <Route exact path="/" element={<Todo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
