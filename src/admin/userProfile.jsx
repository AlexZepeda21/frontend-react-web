import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

function UserProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {
      name: "Usuario Invitado",
      email: "correo@ejemplo.com",
    };
    setUser(userData);
    setName(userData.name);
    setEmail(userData.email);
  }, []);

  const handleSave = () => {
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}

export default UserProfile;
