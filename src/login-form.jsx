'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@radix-ui/react-label';
import { Checkbox } from "./components/ui/checkbox";
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { API_BASE_URL } from './url';

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);

        alert('Inicio de sesión exitoso.');

        if (data.tipo_usuario == 1) {
          navegar("./admin");
        }
        } else if (data.tipo_usuario == 2) {
          navegar("./menus/Menuuser");
        
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-700 to-black">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-8 space-y-6 bg-black rounded-2xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-red-500">Bienvenidos</h1>
          <p className="text-sm text-gray-400">Al sistema de la cafetería</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Campo de email */}
          <div className="space-y-2">
            <Label htmlFor="correo" className="text-red-300 font-medium">Correo Electrónico</Label>
            <Input
              id="correo"
              placeholder="Ingrese su correo electrónico"
              required
              type="email"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 text-gray-200 focus:ring focus:ring-red-500"
            />
          </div>

          {/* Campo de contraseña */}
          <div className="space-y-2">
            <Label htmlFor="clave" className="text-red-300 font-medium">Contraseña</Label>
            <Input
              id="clave"
              placeholder="Ingrese su contraseña"
              required
              type="password"
              value={clave}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 text-gray-200 focus:ring focus:ring-red-500"
            />
          </div>

          {/* Botón de "Recordarme" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="peer h-5 w-5 border border-gray-700 rounded-md checked:bg-red-600"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-400 leading-none peer-disabled:opacity-70"
              >
                Recordarme
              </label>
            </div>
            <a href="#" className="text-sm text-red-500 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón de inicio de sesión */}
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-300"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
          </Button>
        </form>

        {/* Texto de pie */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes una cuenta?{' '}
            <a href="#" className="text-red-500 font-medium hover:underline">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}
