import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import TaskManager from './components/TaskComponent'
import ProtectRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<ProtectRoute />} >
          < Route path='/taskManager' element={<TaskManager />} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App