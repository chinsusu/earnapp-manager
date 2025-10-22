import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Bootstrap (CSS + bundle JS for components)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Custom tweaks
import './styles/custom.css'

createRoot(document.getElementById('root')).render(<App />)
