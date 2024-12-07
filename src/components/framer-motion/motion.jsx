'use client'

import { motion as framerMotion } from "framer-motion"

// Creamos un componente de orden superior (HOC) para motion
const createMotionComponent = (Component) => {
  return framerMotion(Component)
}

// Creamos componentes motion para los elementos HTML comunes
export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  img: createMotionComponent('img'),
  button: createMotionComponent('button'),
  a: createMotionComponent('a'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  // Puedes agregar más elementos según sea necesario
}

// Exportamos las funciones útiles de framer-motion
export const { AnimatePresence } = framerMotion
