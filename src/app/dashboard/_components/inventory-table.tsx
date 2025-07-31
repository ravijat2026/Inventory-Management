"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Package, Archive, Edit2, Save, X, ChevronDown } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  addedAt: string
}

interface InventoryTableProps {
  items: InventoryItem[]
  onEditItem: (id: string, name: string, quantity: number, category: string) => void
  onRemoveItem: (id: string) => void
}

export default function InventoryTable({ items, onEditItem, onRemoveItem }: InventoryTableProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", quantity: "", category: "" })
  const [editShowDropdown, setEditShowDropdown] = useState(false)

  // get unique categories from existing items
  const existingCategories = [...new Set(items.map((item) => item.category))].sort()

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".category-dropdown")) {
        setEditShowDropdown(false)
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

  const handleEditItemClick = (item: InventoryItem) => {
    setEditingItem(item.id)
    setEditForm({
      name: item.name,
      quantity: item.quantity.toString(),
      category: item.category,
    })
  }

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.quantity || !editForm.category.trim()) return

    const quantityValidationError = validateQuantity(editForm.quantity)
    if (quantityValidationError) return

    onEditItem(editingItem!, editForm.name.trim(), Number.parseInt(editForm.quantity), editForm.category.trim())

    setEditingItem(null)
    setEditForm({ name: "", quantity: "", category: "" })
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditForm({ name: "", quantity: "", category: "" })
    setEditShowDropdown(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="border border-gray-700 shadow-sm bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl">
            <Archive className="h-5 w-5 mr-2 text-gray-300" />
            Inventory Items
          </CardTitle>
          <CardDescription className="text-gray-400">
            {items.length === 0 ? "No items in inventory" : `${items.length} items in your inventory`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium mb-2">No items in your inventory</p>
              <p className="text-gray-500">Add your first item using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="font-medium text-gray-300">Item Name</TableHead>
                    <TableHead className="font-medium text-gray-300">Category</TableHead>
                    <TableHead className="font-medium text-gray-300">Quantity</TableHead>
                    <TableHead className="font-medium text-gray-300">Date Added</TableHead>
                    <TableHead className="text-right font-medium text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-700 border-gray-700">
                      <TableCell className="font-medium text-gray-200">
                        {editingItem === item.id ? (
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-700 border-gray-600 text-white"
                          />
                        ) : (
                          item.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem === item.id ? (
                          <div className="relative category-dropdown">
                            <Input
                              placeholder="Enter or select category"
                              value={editForm.category}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white pr-8"
                            />
                            {existingCategories.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setEditShowDropdown(!editShowDropdown)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 cursor-pointer"
                                aria-label="Show category dropdown"
                                title="Show category dropdown"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            )}
                            {editShowDropdown && existingCategories.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                                {existingCategories.map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                      setEditForm((prev) => ({ ...prev, category: cat }))
                                      setEditShowDropdown(false)
                                    }}
                                    className="w-full text-left px-3 py-2 text-white hover:bg-gray-600 focus:bg-gray-600 focus:outline-none cursor-pointer"
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                            {item.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem === item.id ? (
                          <Input
                            type="text"
                            value={editForm.quantity}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === "" || /^\d+$/.test(value)) {
                                setEditForm((prev) => ({ ...prev, quantity: value }))
                              }
                            }}
                            className="w-20 bg-gray-700 border-gray-600 text-white"
                          />
                        ) : (
                          <Badge
                            variant={item.quantity < 10 ? "destructive" : "default"}
                            className={
                              item.quantity < 10
                                ? "bg-red-900/50 text-red-300 border-red-700"
                                : "bg-green-900/50 text-green-300 border-green-700"
                            }
                          >
                            {item.quantity}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400">{item.addedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingItem === item.id ? (
                            <>
                              <Button
                                onClick={handleSaveEdit}
                                size="sm"
                                className="bg-green-200 hover:bg-green-100 text-green-900 cursor-pointer"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                size="sm"
                                className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-gray-800 cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleEditItemClick(item)}
                                variant="outline"
                                size="sm"
                                className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-gray-800 cursor-pointer"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => onRemoveItem(item.id)}
                                variant="destructive"
                                size="sm"
                                className="bg-red-200 hover:bg-red-100 text-red-900 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
