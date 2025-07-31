"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, AlertCircle, ChevronDown } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  addedAt: string
}

interface AddItemFormProps {
  items: InventoryItem[]
  onAddItem: (name: string, quantity: number, category: string) => void
}

export default function AddItemForm({ items, onAddItem }: AddItemFormProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [category, setCategory] = useState("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [quantityError, setQuantityError] = useState("")
  const [nameError, setNameError] = useState("")

  // Get unique categories from existing items
  const existingCategories = [...new Set(items.map((item) => item.category))].sort()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".category-dropdown")) {
        setShowCategoryDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const validateQuantity = (value: string): string => {
    if (!value.trim()) return "Quantity is required"
    const num = Number(value)
    if (!/^\d+$/.test(value) || num <= 0) {
      return "Please enter a positive integer greater than zero"
    }
    return ""
  }

  const validateItemName = (name: string): string => {
    if (!name.trim()) return "Item name is required"
    return ""
  }

  const handleQuantityChange = (value: string) => {
    setQuantity(value)
    const error = validateQuantity(value)
    setQuantityError(error)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    const error = validateItemName(value)
    setNameError(error)
  }

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setShowCategoryDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !quantity || !category.trim()) return

    const quantityValidationError = validateQuantity(quantity)
    const nameValidationError = validateItemName(name)

    if (quantityValidationError || nameValidationError) {
      setQuantityError(quantityValidationError)
      setNameError(nameValidationError)
      return
    }

    const quantityNum = Number.parseInt(quantity)
    onAddItem(name.trim(), quantityNum, category.trim())

    // reset form fields
    setName("")
    setQuantity("")
    setCategory("")
    setQuantityError("")
    setNameError("")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="border border-gray-700 shadow-sm mb-8 bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl">Add New Item</CardTitle>
          <CardDescription className="text-gray-400">Add a new item to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="item-name" className="text-sm font-medium text-gray-300">
                Item Name
              </Label>
              <Input
                id="item-name"
                placeholder="Enter item name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                  nameError ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                }`}
                required
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {nameError}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="item-quantity" className="text-sm font-medium text-gray-300">
                Quantity
              </Label>
              <Input
                id="item-quantity"
                type="text"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className={`mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                  quantityError ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                }`}
                required
              />
              {quantityError && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {quantityError}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="item-category" className="text-sm font-medium text-gray-300">
                Category
              </Label>
              <div className="relative mt-1 category-dropdown">
                <Input
                  id="item-category"
                  placeholder="Enter or select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 pr-8"
                  required
                />
                {existingCategories.length > 0 && (
                  <button
                    type="button"
                    title="Show category dropdown"
                    aria-label="Show category dropdown"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                )}
                {showCategoryDropdown && existingCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {existingCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className="w-full text-left px-3 py-2 text-white hover:bg-gray-600 focus:bg-gray-600 focus:outline-none cursor-pointer"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-gray-200 hover:bg-gray-100 text-gray-900 cursor-pointer"
                disabled={!!quantityError || !!nameError}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}