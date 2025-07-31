"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "./_components/dashboard-header"
import AddItemForm from "./_components/add-item-form"
import InventoryTable from "./_components/inventory-table"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  addedAt: string
}

interface UserData {
  name: string
  email: string
  mobile: string
  registeredAt: string
}

export default function DashboardPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      const savedUserData = localStorage.getItem("user-data")
      const authToken = localStorage.getItem("auth-token")

      if (!savedUserData || !authToken) {
        router.push("/")
        return
      }

      try {
        const parsedUserData = JSON.parse(savedUserData)
        setUserData(parsedUserData)

        const cookies = document.cookie.split(";")
        const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("session="))

        if (!sessionCookie || !sessionCookie.includes("authenticated")) {
          document.cookie = "session=authenticated; path=/; max-age=86400"
        }

        setLoading(false)
      } catch (error) {
        localStorage.removeItem("user-data")
        localStorage.removeItem("auth-token")
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  // Load items from localStorage
  useEffect(() => {
    if (!loading && userData) {
      const savedItems = localStorage.getItem("inventory-items")
      if (savedItems) {
        try {
          setItems(JSON.parse(savedItems))
        } catch (error) {
          console.error("Error loading inventory items:", error)
        }
      }
    }
  }, [loading, userData])

  // Save items to localStorage
  useEffect(() => {
    if (!loading && userData) {
      localStorage.setItem("inventory-items", JSON.stringify(items))
    }
  }, [items, loading, userData])

  const handleAddItem = (name: string, quantity: number, category: string) => {
    // Check if item with same name and category already exists
    const existingItemIndex = items.findIndex(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() && item.category.toLowerCase() === category.toLowerCase(),
    )

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      setItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      )
    } else {
      // Create new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: name,
        quantity: quantity,
        category: category,
        addedAt: new Date().toLocaleDateString(),
      }
      setItems((prev) => [...prev, newItem])
    }
  }

  const handleEditItem = (id: string, name: string, quantity: number, category: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: name,
              quantity: quantity,
              category: category,
            }
          : item,
      ),
    )
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem("user-data")
    localStorage.removeItem("inventory-items")
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-password")
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader userData={userData} items={items} onLogout={handleLogout} />
      <AddItemForm items={items} onAddItem={handleAddItem} />
      <InventoryTable items={items} onEditItem={handleEditItem} onRemoveItem={handleRemoveItem} />
    </div>
  )
}
