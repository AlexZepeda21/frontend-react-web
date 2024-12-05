'use client';  
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Label } from '@radix-ui/react-label'; 
import { Checkbox } from "./components/ui/checkbox";
import { Button } from './components/ui/button'; 
import { Input } from './components/ui/input'; 
import { clsx } from 'clsx'; 

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
      const response = await fetch('http://127.0.0.1:8000/api/login', {         
        method: 'POST',         
        headers: { 'Content-Type': 'application/json' },         
        body: JSON.stringify(loginData),       
      });        
      
      if (!response.ok) throw new Error('Credenciales inválidas');        
      
      const data = await response.json();        
      
      if (data.token) {         
        localStorage.setItem('token', data.token);         
        alert('Inicio de sesión exitoso'); 

        if(data.tipo_usuario == 1){
          navegar("./menus/Menuadmin");
        }
        else if(data.tipo_usuario == 1){
          navegar("./menus/Menuuser");
        }
        
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
          <Label htmlFor="correo">Email</Label>           
          <Input             
            id="correo"             
            placeholder="Ingrese su correo electrónico"             
            required             
            type="email" // Corregido             
            value={correo}             
            onChange={(e) => setEmail(e.target.value)}             
            disabled={isLoading}           
          />         
        </div>          
        
        {/* Campo de contraseña */}         
        <div className="space-y-2">           
          <Label htmlFor="clave">Contraseña</Label>           
          <Input             
            id="clave"             
            placeholder="Ingrese su contraseña"             
            required             
            type="password" // Corregido             
            value={clave}             
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
          <a href="#" onClick={() => navegar("/register-form")}> // Corregido           
            Créala aquí           
          </a>         
        </p>       
      </div>     
    </div>   
  ); 
}
