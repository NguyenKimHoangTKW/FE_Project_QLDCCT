import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='981819618795-ccoc8pkplf0kif7apik7tmal7e1o28cc.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>,
)
