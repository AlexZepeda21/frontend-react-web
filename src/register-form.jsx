import React, { useState } from "react";
import Image from "./components/ui/Image";
import Link from "./components/ui/Link";
import { Mail, Lock, KeyRound } from "lucide-react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validaciones del lado del cliente
    const validationErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Invalid email format.";
    }
    if (!formData.password || formData.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_tipo_usuario: 1, // Valor fijo
          correo: formData.email, // Email del formulario
          clave: formData.password, // Contraseña del formulario
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ api: errorData.message || "Validation error occurred." });
        return;
      }
  
      const result = await response.json();
      alert("Registration successful!");
      console.log("Success response:", result);
    } catch (error) {
      console.error("Network or server error:", error);
      setErrors({ api: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen grid lg:grid-cols-2 gap-8 p-8 bg-gray-800">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-8">Sign up</h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                Your Email
              </div>
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-400" />
                Password
              </div>
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-gray-400" />
                Repeat your password
              </div>
            </Label>
            <Input
              id="confirmPassword"
              placeholder="Repeat your password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
          <Button
            type="submit"
            className={`w-full ${isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "REGISTER"}
          </Button>
        </form>
      </div>
      <div className="hidden lg:flex items-center justify-center">
        <Image
          src="https://www.itca.edu.sv/wp-content/themes/elaniin-itca/images/logoColor.png"
          alt="Sign up illustration"
          width={500}
          height={400}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
