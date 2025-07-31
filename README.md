# 📦 Inventory Pro - Smart Inventory Management System

A modern, responsive inventory management application built with Next.js 14, TypeScript, and Tailwind CSS. Features a clean dark theme interface with comprehensive inventory tracking capabilities.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration**: Complete user registration with form validation
- **Auto-redirect**: Automatic dashboard access for authenticated users
- **Session Management**: Persistent login sessions with secure token handling
- **Form Validation**: Real-time validation with detailed error messages

### 📊 Dashboard & Analytics
- **Statistics Overview**: Real-time stats for total items, products, categories, and low stock alerts
- **Responsive Design**: Fully responsive interface that works on all devices
- **Dark Theme**: Professional dark theme with excellent contrast and readability

### 📝 Inventory Management
- **Smart Item Addition**: Intelligent quantity merging for duplicate items (same name + category)
- **Category Management**: Dynamic category dropdown with existing category suggestions
- **Inline Editing**: Edit items directly in the table with real-time validation
- **Bulk Operations**: Add, edit, and delete inventory items efficiently

### 🎨 User Experience
- **Modern UI**: Clean, professional interface built with shadcn/ui components
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Loading States**: Smooth loading indicators for better user feedback
- **Accessibility**: Built with accessibility best practices in mind

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage
- **State Management**: React Hooks (useState, useEffect)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/inventory-pro.git
   cd inventory-pro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started
1. **Registration**: Fill out the registration form with your details
2. **Dashboard Access**: Automatically redirected to your inventory dashboard
3. **Add Items**: Use the "Add New Item" form to add inventory items
4. **Manage Inventory**: Edit, delete, or update quantities directly in the table

### Key Features
- **Smart Quantity Management**: Adding an item with the same name and category will automatically increase the quantity
- **Category System**: Create and reuse categories with the dropdown selector
- **Low Stock Alerts**: Items with quantity < 10 are highlighted in red
- **Data Persistence**: All data is saved locally in your browser

## 📁 Project Structure

```
inventory-pro/
├── app/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── dashboard-header.tsx     # Header with stats and user info
│   │   │   ├── add-item-form.tsx        # Form for adding new items
│   │   │   ├── inventory-table.tsx      # Table with inventory listing
│   │   └── page.tsx                     # Main dashboard page
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Registration/landing page
├── components/
│   └── ui/                              # shadcn/ui components
├── lib/
│   └── utils.ts                         # Utility functions
├── middleware.ts                        # Next.js middleware
└── README.md
```


## 🔧 Component Architecture

The application follows a modular component architecture:

- **`DashboardHeader`**: Displays user info, statistics, and logout functionality
- **`AddItemForm`**: Handles new item creation with validation
- **`InventoryTable`**: Manages item display, editing, and deletion

Each component is self-contained with clear prop interfaces for easy maintenance and testing.

## 🎯 Form Validation

### Registration Form
- **Name**: 2+ characters, letters and spaces only
- **Email**: Valid email format with regex validation
- **Password**: 8+ characters with uppercase, lowercase, number, and special character
- **Mobile**: Exactly 10 digits

### Inventory Form
- **Item Name**: Required, non-empty string
- **Quantity**: Positive integers only
- **Category**: Required, supports existing category selection

## 💾 Data Storage

- **Local Storage**: All user data and inventory items are stored in browser's localStorage
- **Session Management**: Authentication tokens and session cookies for security
- **Data Persistence**: Automatic saving and loading of inventory data



## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact [ravijat2026@gmail.com](mailto:ravijat2026l@gmail.com).

---

**Made with ❤️ by Ravi Jat**
