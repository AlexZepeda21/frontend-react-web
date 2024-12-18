'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { API_BASE_URL } from '../url';
import Swal from 'sweetalert2';
import '../styles/login/estilosregister.css';

export default function Registro() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [tipo, setTipo] = useState('administrador'); // Valor inicial (opción del select)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    // Convertir el tipo de usuario en valor numérico
    const tipoUsuario = tipo === 'administrador' ? 1 : 2;

    const registroData = { 
      correo, 
      clave, 
      id_tipo_usuario: tipoUsuario // Enviar el tipo de usuario como número
    };

    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registroData),
      });

      if (!response.ok) throw new Error('Error al registrar el usuario');

      const data = await response.json();

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El usuario ha sido registrado correctamente',
        confirmButtonText: 'Aceptar',
      });

      // Redirigir a la ruta deseada
      navigate('/admin/usuario');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.message || 'No se pudo registrar el usuario',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function onCancel() {
    // Restablecer el formulario
    setCorreo('');
    setClave('');
    setTipo('administrador');

    // Navegar a la página de usuarios
    navigate('/admin/usuario');
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Registrar Usuarios</h1>
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <div className="input-wrapper">
              <MdEmail className="input-icon" />
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="input-field"
                placeholder="Ingrese un correo"
                required
              />
            </div>
          </div>
          <div className="input-container">
            <Label htmlFor="clave">Contraseña</Label>
            <div className="input-wrapper">
              <MdLock className="input-icon" />
              <Input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="input-field"
                placeholder="Ingrese una contraseña"
                required
              />
            </div>
          </div>
          <div className="input-container">
            <Label htmlFor="tipo">Tipo de Usuario</Label>
            <div className="input-wrapper">
              <MdPerson className="input-icon" />
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="input-field"
                required
              >
                <option value="administrador">Administrador</option>
                <option value="chef">Chef</option>
              </select>
            </div>
          </div>
          <div className="button-group">
            <Button
              type="submit"
              className="btnregistrar"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'REGISTRAR'}
            </Button>
            <Button
              type="button"
              className="btncancelar"
              onClick={onCancel}
            >
              CANCELAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
