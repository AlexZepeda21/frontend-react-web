'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@radix-ui/react-label';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Button } from './components/ui/button'; // Asegúrate de que el botón esté bien importado
import { Input } from './components/ui/input'; // Asegúrate de que el Input esté bien importado
import { clsx } from 'clsx'; // Importa clsx si lo necesitas para manipular clases condicionales

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const loginData = { email, password };

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('idUser', data.idUser);
        alert('Inicio de sesión exitoso');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-blue-600">
          ACCOUNT LOGIN
        </h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Campo de email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Ingrese su correo electrónico"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            placeholder="Ingrese su contraseña"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Botón de "Recordarme" */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="peer h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-600"
            />

            <label
              htmlFor="remember"
              className="text-sm leading-none  peer-disabled:opacity-70"
            >
              Recordarme
            </label>
          </div>
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-700 px-0"
            disabled={isLoading}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>

        {/* Botón de inicio de sesión */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
        </Button>
      </form>

      {/* Enlace para redirigir a la página de registro */}
      <div className="mt-3 text-center">
        <p>
          ¿No tienes cuenta?{' '}
          <a href="#" onClick={() => alert('Redirigir a registro')}>
            Créala aquí
          </a>
        </p>
      </div>
    </div>
  );
}