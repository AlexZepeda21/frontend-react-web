'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@radix-ui/react-label';
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

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();

      if (data.token) {
        // Usando SweetAlert2 para mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido de nuevo',
          confirmButtonText: 'Aceptar',
        });

        localStorage.setItem('id', data.id);
        localStorage.setItem('correo', data.correo);

        // Pasamos los datos al siguiente componente usando estado de navegación
        if (data.tipo_usuario === 1) {
          navegar("/admin", { state: { token: data.token, tipo_usuario: data.tipo_usuario } });
        } else if (data.tipo_usuario === 2) {
          navegar("/menus/Menuuser", { state: { token: data.token, tipo_usuario: data.tipo_usuario } });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // Usando SweetAlert2 para mostrar error
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error.message,
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
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
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
          </Button>
        </form>
      </div>
    </div>
  );
}
