
import "./App.css";
import { useContext } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser, loading } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
