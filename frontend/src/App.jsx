import React from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import LoginPage from './pages/loginPage.jsx'
import CreateAccount from './pages/createAccount.jsx'
import UserHomepage from './pages/user/userHomepage.jsx'
import AdminHomepage from './pages/admin/adminHomepage.jsx'
import AddState from './pages/admin/addstate.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster position="top-center" />
<Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<CreateAccount />}/>
      <Route path="/user/userHomepage" element={<UserHomepage />} />
      <Route path="/admin/adminHomepage" element={<AdminHomepage />} />
      <Route path="/admin/addstate" element={<AddState />} />

</Routes>
    </div>
  )
}

export default App