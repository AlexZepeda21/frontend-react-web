import React from 'react'
import { Clock, ChefHat, Share2 } from 'lucide-react'
import { Button } from './ui/button'
import { Image } from 'react-bootstrap'
import { Card, CardContent, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
const RecipeCard = ({
  title,
  author,
  date,
  cookingTime,
  difficulty,
  type,
  cuisine,
  imageUrl,
  ingredients,
  description
}) => {
  return (
    <Card className=" mx-auto">
      <CardHeader className="space-y-6 pb-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center">{title}</h1>
          <div className="flex justify-center items-center gap-2">
            <div className="h-0.5 w-16 bg-red-500" />
            <div className="h-0.5 w-16 bg-red-500" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600">{date}</p>
          <p className="font-medium">{author}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">TIEMPO:</p>
              <p className="font-semibold">{cookingTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">DIFICULTAD:</p>
              <p className="font-semibold">{difficulty}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">TIPO:</p>
            <p className="font-semibold text-red-500">{type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">COCINA:</p>
            <p className="font-semibold">{cuisine}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          {/* Add more social sharing buttons as needed */}
        </div>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 gap-6 p-6">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">{description}</p>

          <div>
            <h2 className="text-2xl font-bold mb-4">Ingredientes</h2>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                  <span>
                    {ingredient.amount && `${ingredient.amount} `}
                    {ingredient.unit && `${ingredient.unit} de `}
                    {ingredient.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

RecipeCard.defaultProps = {
  title: "Receta de lasaña tradicional casera",
  author: "Josselin Melara",
  date: "Julio 2023",
  cookingTime: "1:10",
  difficulty: "MEDIA",
  type: "RECETAS DE COMIDA",
  cuisine: "ITALIANA",
  imageUrl: "/placeholder.svg",
  ingredients: [],
  description: "Prepara una lasaña tradicional fácilmente, te decimos cómo hacerlo paso a paso"
}

export default RecipeCard

