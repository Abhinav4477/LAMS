import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";



const LoginPage=()=> {
 const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
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
  };
  return (
    <div>
    <Navbar />
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black z-20">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login here
      </h2>
      
 
      <form className="my-8" onSubmit={handleSubmit}>
       
       
        <LabelInputContainer className="mb-8">
          <Label htmlFor="twitterpassword">Username</Label>
          <Input
            id="uname"
            placeholder="username"
            type="text"
             onChange={(e)=> setUsername(e.target.value)} value={username}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </LabelInputContainer>
        
 
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign In &rarr;
          <BottomGradient />
        </button>
 
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      </form>
       
    </div>
    <ShootingStars />
      <StarsBackground />
      </div>
    <Footer />
    </div>
  );
}
 
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
 
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
export default LoginPage