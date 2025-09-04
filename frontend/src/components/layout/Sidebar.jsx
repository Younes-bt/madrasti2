import React from 'react'
import { AppSidebar } from './AppSidebar'

// This is now just a wrapper component that renders the new shadcn AppSidebar
// The SidebarProvider should be placed at a higher level (like in the layout component)
const Sidebar = ({
  isOpen = false,
  onClose = () => {},
  className,
  currentPath = '/',
  userRole = null,
  onNavigate = () => {},
}) => {
  return (
    <AppSidebar 
      onNavigate={onNavigate}
      currentPath={currentPath}
      className={className}
    />
  )
}

export default Sidebar