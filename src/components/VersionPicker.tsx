import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './VersionPicker.css'

const LOOKS = [
  { to: '/', label: '1', name: 'Current' },
  { to: '/v2', label: '2', name: 'Editorial' },
  { to: '/v3', label: '3', name: 'Lookbook' },
] as const

const STORAGE_KEY = 'bbm-look'

export default function VersionPicker() {
  const location = useLocation()

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, location.pathname)
  }, [location.pathname])

  return (
    <nav className="look-picker" aria-label="Design looks for client review">
      <p className="look-picker__label">Look</p>
      {LOOKS.map(look => (
        <NavLink
          key={look.to}
          to={look.to}
          end={look.to === '/'}
          className={({ isActive }) =>
            `look-picker__chip${isActive ? ' is-active' : ''}`
          }
          title={look.name}
        >
          {look.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function readSavedLook(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
