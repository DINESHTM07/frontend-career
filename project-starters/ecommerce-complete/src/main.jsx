import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

/*
  WHY StrictMode: In development, React renders each component TWICE to help
  detect side effects that should be pure. This catches bugs like:
  - State mutations
  - Impure render functions
  - Missing cleanup in useEffect
  StrictMode only affects development — in production it has zero overhead.

  WHY BrowserRouter here (not in App): The Router must wrap everything that
  uses routing hooks (useNavigate, useParams, Link). Putting it in main.jsx
  keeps App.jsx clean and makes the routing boundary obvious.
*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
