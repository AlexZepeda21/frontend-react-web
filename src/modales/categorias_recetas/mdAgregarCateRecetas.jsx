'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function RecipeCategoryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/categoria-recetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          created_at: new Date(),
          updated_at: new Date()
        }),
      })
      if (response.ok) {
        alert('Categoría de receta creada con éxito!')
        setIsOpen(false)
      } else {
        throw new Error('Error al crear la categoría')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al crear la categoría')
    }
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Agregar Categoría de Receta</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Nueva Categoría de Receta</h2>
              <p className="text-sm opacity-80">Añade una nueva categoría para tus deliciosas recetas</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-lg font-medium">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Postres"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-lg font-medium">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Recetas para hacer postres"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="estado"
                  checked={formData.estado}
                  onCheckedChange={(checked) => setFormData({ ...formData, estado: checked })}
                />
                <Label htmlFor="estado" className="text-lg font-medium">Activo</Label>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  Guardar Categoría
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

