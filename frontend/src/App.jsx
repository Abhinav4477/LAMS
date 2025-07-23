import React from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import LoginPage from './pages/loginPage.jsx'
import CreateAccount from './pages/createAccount.jsx'

const App = () => {
  return (
    <div>
<Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<CreateAccount />}/>

</Routes>
    </div>
  )
}

export default App