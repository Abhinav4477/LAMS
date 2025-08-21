import React, { useState } from 'react';
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from 'react-hot-toast';
import axios from 'axios';

const Addstate = () => {
     const [name, setstatename] = useState("");
 // const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!name.trim() ) {
      toast.error('Please fill in all fields');
      return;
    }
    try{
      await axios.post("http://localhost:5001/api/admin/addstate", {
       name
      });
      toast.success('State Added Successfully');
      //navigate('/login'); // Redirect to login page after successful registration
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

  };

  return (
        <SidebarLayout> 
    <div>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Add State</legend>
<form onSubmit={handleSubmit}>
  <label className="label">Name</label>
  <input type="text" className="input" placeholder="state name"  onChange={(e) => setstatename(e.target.value)} value={name} />

  

  <button className="btn btn-neutral mt-4" type="submit">Add</button>
  </form>
</fieldset>

    </div>
</SidebarLayout>
  )
}

export default Addstate