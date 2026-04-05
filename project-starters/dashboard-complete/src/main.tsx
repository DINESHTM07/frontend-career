import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/*
  WHY StrictMode:
  In development, React renders each component TWICE to catch impure renders,
  missing effect cleanups, and deprecated API usage. Zero overhead in production.
*/
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
