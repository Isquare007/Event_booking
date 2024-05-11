import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import authContext from "./context/auth-context";
import MainNavigation from "./component/Navigation/MainNav";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <authContext.Provider
          value={{
            token: token,
            userId: userId,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation/>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/events" element={<EventsPage />} />
            {token && (
              <Route path="/auth" element={<Navigate replace to="/events" />} />
            )}
            {!token && (
              <Route path="/" element={<Navigate replace to="/auth" />} />
            )}
            {!token && <Route path="/auth" element={<AuthPage />} />}
          </Routes>
        </authContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}
export default App;
