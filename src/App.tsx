import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorialPage from './pages/v2/EditorialPage'
import LookbookPage from './pages/v3/LookbookPage'
import './App.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/v2" element={<EditorialPage />} />
        <Route path="/v3" element={<LookbookPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
