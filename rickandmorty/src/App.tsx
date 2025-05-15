import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Authentication from './Authentication'
import Characterlist from './Character-list'
import CharacterDetails from './CharacterDetails'
import { getAuthToken } from './api/axios-functions'

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = getAuthToken();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route 
          path="/characters" 
          element={
            <ProtectedRoute>
              <Characterlist />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/characters/:id" 
          element={
            <ProtectedRoute>
              <CharacterDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/characters" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App