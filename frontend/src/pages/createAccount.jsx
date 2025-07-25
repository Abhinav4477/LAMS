import React,{useState} from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] =useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('user'); // Assuming role is not used in this form
  const navigate = useNavigate();
   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try{
      await axios.post("http://localhost:5001/api/auth/register", {
        username,
        password,
        email,
        role
      });
      toast.success('Account created successfully');
      navigate('/login'); // Redirect to login page after successful registration
    }
    catch (error) {
      console.error(error);
      toast.error('Error creating account');
      const message =
    error.response?.data?.message || 
    error.response?.data?.error || 
    error.message || 
    'Unknown error';
    
  toast.error(message);
    }
  }
    
  return (
    <div  >
 <Navbar />
 <div className='grid grid-rows-[auto_1fr_auto] h-screen hero bg-base-200 min-h-screen' style={{ backgroundImage: "url(/c.jpg)" }}>
 <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto " >
  <form onSubmit={handleSubmit} >
  <legend className="fieldset-legend font-black text-3xl mx-auto ">Register</legend>
   <label className="label">Username</label>
  <input type="text" className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

  <label className="label">Email</label>
  <input type="email" className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />

  <label className="label">Password</label>
  <input type="password" className="input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />

  <button className="btn btn-neutral mt-4" type='submit'>Register</button>
  </form>
</fieldset>

</div>
 <Footer />
    </div>
  )
};

export default CreateAccount