"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, LogOut, User, BarChart3, Archive, AlertTriangle } from "lucide-react"

interface UserData {
  name: string
  email: string
  mobile: string
  registeredAt: string
}

interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  addedAt: string
}

interface DashboardHeaderProps {
  userData: UserData | null
  items: InventoryItem[]
  onLogout: () => void
}

export default function DashboardHeader({ userData, items, onLogout }: DashboardHeaderProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockItems = items.filter((item) => item.quantity < 10).length
  const existingCategories = [...new Set(items.map((item) => item.category))].sort()

  return (
    <>
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-gray-300 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Inventory Dashboard</h1>
                  <p className="text-sm text-gray-400">Welcome back, {userData?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {userData && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-300 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              )}
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-700 shadow-sm bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-gray-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Items</p>
                  <p className="text-2xl font-bold text-white">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 shadow-sm bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Archive className="h-8 w-8 text-gray-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Products</p>
                  <p className="text-2xl font-bold text-white">{items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 shadow-sm bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-gray-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-white">{existingCategories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 shadow-sm bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-400">{lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
