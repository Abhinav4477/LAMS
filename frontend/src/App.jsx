import React from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import LoginPage from './pages/loginPage.jsx'
import CreateAccount from './pages/createAccount.jsx'
import CreateServiceProviderAccount from './pages/createserviceproviderAccount.jsx'
import UserHomepage from './pages/user/userHomepage.jsx'
import AdminHomepage from './pages/admin/adminHomepage.jsx'
import AddState from './pages/admin/addstate.jsx'
import ViewState from './pages/admin/viewstate.jsx'
import UpdateState from './pages/admin/updatestate.jsx'
import Adddistrict from './pages/admin/adddistrict.jsx'
import Viewdistrict from './pages/admin/viewdistrict.jsx'
import UpdateDistrict from './pages/admin/updatedistrict.jsx'
import Addlocation from './pages/admin/addlocation.jsx'
import Viewlocation from './pages/admin/viewlocation.jsx'
import UpdateLocation from './pages/admin/updatelocation.jsx'
import Addcategory from './pages/admin/addcategory.jsx'
import Viewcategory from './pages/admin/viewcategories.jsx'
import UpdateCategory from './pages/admin/updatecategory.jsx'
import ServiceproviderHomepage from './pages/serviceprovider/serviceproviderHomepage.jsx'
import Viewsprequests from './pages/admin/viewsprequests.jsx'
import AddService from './pages/serviceprovider/addservice.jsx'
import ViewServices from './pages/serviceprovider/viewservice.jsx'
import UpdateService from './pages/serviceprovider/updateservice.jsx'

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
      <Route path="/admin/viewstate" element={<ViewState />} />
     <Route path="/admin/updatestate/:id" element={<UpdateState />} />
     <Route path="/admin/adddistrict" element={<Adddistrict />} />
      <Route path="/admin/viewdistrict" element={<Viewdistrict />} />
      <Route path="/admin/updatedistrict/:id" element={<UpdateDistrict />} />
      <Route path="/admin/addlocation" element={<Addlocation />} />
      <Route path="/admin/viewlocation" element={<Viewlocation />} />
      <Route path="/admin/updatelocation/:id" element={<UpdateLocation />} />
      <Route path="/admin/addcategory" element={<Addcategory />} />
      <Route path="/admin/viewcategory" element={<Viewcategory />} />
      <Route path="/admin/updatecategory/:id" element={<UpdateCategory />} />
      <Route path="/register/provider" element={<CreateServiceProviderAccount />} />
      <Route path="/serviceprovider/serviceproviderHomepage" element={<ServiceproviderHomepage />} />
      <Route path="/admin/viewsprequests" element={<Viewsprequests />} />
      <Route path="/serviceprovider/addservice" element={<AddService />} />
      <Route path="/serviceprovider/viewservices" element={<ViewServices />} />
      <Route path="/serviceprovider/updateservice/:id" element={<UpdateService />} />
      


</Routes>
    </div>
  )
}

export default App