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

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [registroData, setRegistroData] = useState({
    correo: '',
    clave: '',
    nombre: '',
    apellido: '',
    genero: '',
    carrera: 'Trabajador ITCA',
    id_tipo_usuario: 0,
  });


  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Validación de campos
      if (
        !registroData.apellido ||
        !registroData.carrera ||
        !registroData.clave ||
        !registroData.genero ||
        !registroData.id_tipo_usuario ||
        registroData.id_tipo_usuario === 0 ||  // Verifica correctamente el tipo de número
        !registroData.nombre
      ) {
        Swal.fire({
          icon: 'question',
          title: 'Registro invalido',
          text: 'Alguno de los datos insertados es invalido',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }
      else {
        // Realizar solicitud de registro
        const response = await fetch(`${API_BASE_URL}/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registroData),
        });

        // Si la respuesta es exitosa
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'El usuario ha sido registrado correctamente!',
            toast: true,  // Notificación tipo toast
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,  // Duración de la notificación en milisegundos
          });

          // Redirigir a la ruta deseada
          navigate(`${ADMIN}/usuario`);
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'question',
            title: 'El usuario ya existe',
            text: 'Cambia el correo electronico',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'No se pudo registrar el usuario',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function Limpiar() {
    setRegistroData({
      correo: '',
      clave: '',
      nombre: '',
      apellido: '',
      genero: '',
      id_tipo_usuario: '0', // Valor por defecto de tipo de usuario
    });
  }

  function onCancel() {
    // Restablecer el formulario
    setRegistroData({
      correo: '',
      clave: '',
      nombre: '',
      apellido: '',
      genero: '',
      id_tipo_usuario: '0',
    });
    navigate(`${ADMIN}/usuario`);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Registrar Usuarios</h1>
        <button className="form-control btn btn-primary" onClick={Limpiar}>Limpiar formulario</button>
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <div className="input-wrapper">
              <MdEmail className="input-icon" />
              <Input
                id="correo"
                type="email"
                value={registroData.correo}
                onChange={(e) => setRegistroData({ ...registroData, correo: e.target.value })}
                className="input-field"
                placeholder="Ingrese su correo electrónico"
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
                value={registroData.clave}
                onChange={(e) => setRegistroData({ ...registroData, clave: e.target.value })}
                className="input-field"
                placeholder="Ingrese una contraseña"
                required
              />
            </div>
          </div>

          <div className="input-container">
            <Label htmlFor="nombre">Nombre</Label>
            <div className="input-wrapper">
              <Input
                id="nombre"
                type="text"
                value={registroData.nombre}
                onChange={(e) => setRegistroData({ ...registroData, nombre: e.target.value })}
                className="input-field"
                placeholder="Ingrese su nombre"
                required
              />
            </div>
          </div>

          <div className="input-container">
            <Label htmlFor="apellido">Apellido</Label>
            <div className="input-wrapper">
              <Input
                id="apellido"
                type="text"
                value={registroData.apellido}
                onChange={(e) => setRegistroData({ ...registroData, apellido: e.target.value })}
                className="input-field"
                placeholder="Ingrese su apellido"
                required
              />
            </div>
          </div>

          <div className="input-container">
            <Label htmlFor="genero">Género</Label>
            <div className="input-wrapper">
              <select
                id="genero"
                value={registroData.genero}
                onChange={(e) => setRegistroData({ ...registroData, genero: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Seleccione un genero</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

          <div className="input-container">
            <Label htmlFor="tipo">Tipo de Usuario</Label>
            <div className="input-wrapper">
              <select
                id="tipo"
                value={registroData.id_tipo_usuario}
                onChange={(e) => setRegistroData({ ...registroData, id_tipo_usuario: e.target.value })}
                className="input-field"
                required
              >
                <option value="0">Seleccione la dificultad</option>
                <option value="1">Administrador</option>
                <option value="2">Chef</option>
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
