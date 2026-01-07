import React, { createContext, useContext, useState, useEffect } from 'react'

const LabContext = createContext()

export const useLabContext = () => {
  const context = useContext(LabContext)
  if (!context) {
    throw new Error('useLabContext must be used within a LabProvider')
  }
  return context
}

export const LabProvider = ({ children }) => {
  const [labState, setLabState] = useState({
    recentTools: [],
    favoriteTools: [],
    selectedCategory: 'all',
    searchQuery: '',
    settings: {
      showSteps: true,
      decimalPrecision: 2,
      angleMode: 'deg'
    }
  })

  const [currentSession, setCurrentSession] = useState(null)

  useEffect(() => {
    const savedState = localStorage.getItem('madrasti_lab_state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setLabState(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to parse lab state:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('madrasti_lab_state', JSON.stringify({
      favoriteTools: labState.favoriteTools,
      settings: labState.settings
    }))
  }, [labState.favoriteTools, labState.settings])

  const updateSettings = (newSettings) => {
    setLabState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }))
  }

  const setCategory = (category) => {
    setLabState(prev => ({ ...prev, selectedCategory: category }))
  }

  const setSearch = (query) => {
    setLabState(prev => ({ ...prev, searchQuery: query }))
  }

  const addRecentTool = (toolId) => {
    setLabState(prev => ({
      ...prev,
      recentTools: [
        toolId,
        ...prev.recentTools.filter(id => id !== toolId)
      ].slice(0, 5)
    }))
  }

  const toggleFavorite = (toolId) => {
    setLabState(prev => ({
      ...prev,
      favoriteTools: prev.favoriteTools.includes(toolId)
        ? prev.favoriteTools.filter(id => id !== toolId)
        : [...prev.favoriteTools, toolId]
    }))
  }

  const value = {
    labState,
    setLabState,
    currentSession,
    setCurrentSession,
    updateSettings,
    setCategory,
    setSearch,
    addRecentTool,
    toggleFavorite
  }

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>
}

export default LabContext
