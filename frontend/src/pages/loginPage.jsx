import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const res=await axios.post("http://localhost:5001/api/auth/login", {
        username,
        password
      }, {
        withCredentials: true
      });
      toast.success('Login successful');
   console.log(res.data);
         // Assuming the response contains user data and role
         localStorage.setItem('user', JSON.stringify(res.data));
         // Redirect based on user role
        const role = res.data.role;
         if (role === 'admin') {
    navigate('/admin/adminHomepage');
  } else if (role === 'user') {
    navigate('/user/userHomepage'); // Or homepage
  }
    } catch (error) { 
      console.error(error);
      toast.error('Error logging in');
      toast.error(error?.response?.data?.error || 'Error logging in');

    }
  }

    // Add login logic here, e.g., API call to authenticate user
    // If successful, navigate to the dashboard or home page
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
       <div className="hero bg-base-200 min-h-screen" style={{ backgroundImage: "url(/c.jpg)" }}>
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Login now!</h1>
      <p className="py-6">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <form onSubmit={handleLogin}>
        <fieldset className="fieldset">
          <label className="label">Username</label>
          <input type="text" className="input" placeholder="Username" onChange={(e)=> setUsername(e.target.value)} value={username} />
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} value={password} />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4" type="submit">Login</button>
        </fieldset>
        </form>
      </div>
        
    </div>
  </div>
</div>
      <Footer />
    </div>
  )
}

export default LoginPage