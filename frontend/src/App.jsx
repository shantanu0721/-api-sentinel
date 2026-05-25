import { Routes, Route } from "react-router-dom"

import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

function App() {

  return (

    <Routes>

      <Route path="/" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/login" element={<Login />} />

    </Routes>

  )

}

export default App