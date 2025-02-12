'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { MdEmail, MdLock } from "react-icons/md";
import { API_BASE_URL } from './url';
import './styles/login/estiloslogin.css';
import Swal from 'sweetalert2'; // Importar SweetAlert2

export default function Login() {
  const [correo, setEmail] = useState('');
  const [clave, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navegar = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const loginData = { correo, clave };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido de nuevo',
          toast: true,  // Notificación tipo toast
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación en milisegundos
        });

        localStorage.setItem('id', result.id);
        localStorage.setItem('correo', result.correo);

        if (result.estado === true) {
          if (result.tipo_usuario === 1) {
            navegar("/admin/Fechas", { state: { token: result.token, tipo_usuario: result.tipo_usuario } });
          } else if (result.tipo_usuario === 2) {
            navegar("/chef", { state: { token: result.token, tipo_usuario: result.tipo_usuario } });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario inactivo. Por favor, contacte al administrador.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } else {
        throw new Error(result.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container cuerpo">
      <div className="login-card">
        <h1 className="login-title">Bienvenidos</h1>
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <div className="input-wrapper">
              <MdEmail className="input-icon" />
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Ingrese su correo"
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
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="btninicio"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
          </Button>
        </form>
      </div>
    </div>
  );
}
