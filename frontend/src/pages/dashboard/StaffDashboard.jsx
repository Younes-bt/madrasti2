import React from 'react'
import StaffHome from '../staff/StaffHome'

/**
 * Staff Dashboard
 * 
 * Unified dashboard for all staff positions (Driver, Accountant, Director, Assistant, General Supervisor).
 * Uses the Hybrid approach: single route with position-specific content via StaffHome component.
 * 
 * Security: Backend enforces position-based permissions. Frontend filtering is for UX only.
 */
const StaffDashboard = () => {
    return <StaffHome />
}

export default StaffDashboard
