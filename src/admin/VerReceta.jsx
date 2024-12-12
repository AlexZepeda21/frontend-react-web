import React from 'react'
import RecipeCard from '../components/RecipeCard'

const Page = () => {
  const recipeData = {
    title: "Receta de lasaña tradicional casera",
    author: "Josselin Melara",
    date: "Julio 2023",
    cookingTime: "1:10",
    difficulty: "MEDIA",
    type: "RECETAS DE COMIDA",
    cuisine: "ITALIANA",
    imageUrl: "/lasagna.jpg",
    description: "Prepara una lasaña tradicional fácilmente, te decimos cómo hacerlo paso a paso",
    ingredients: [
      { amount: "1", item: "paquete de láminas de lasaña" },
      { amount: "1", item: "zanahoria" },
      { amount: "500", unit: "gram", item: "carne molida de res" },
      { amount: "200", unit: "gram", item: "queso parmesano rallado" },
      { amount: "200", unit: "gram", item: "queso manchego rallado" },
      { amount: "200", unit: "gram", item: "queso ricotta rallado" },
      { amount: "½", item: "cebolla finamente picada" },
      { amount: "2", item: "dientes de ajo finamente picados" },
      { amount: "1", item: "raja de apio finamente picado" },
      { amount: "4", item: "jitomates sin semillas y en cubos" },
      { amount: "2", unit: "tazas", item: "puré de tomate" },
    ]
  }

  return <RecipeCard {...recipeData} />
}

export default Page

