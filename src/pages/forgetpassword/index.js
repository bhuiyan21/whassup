import React, { useState } from 'react'
import { Link,useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
const Forgetpass = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  let [email, setEmail] = useState("");
  let handelUpdatePass = ()=>{
    sendPasswordResetEmail(auth, email).then(() => {
    toast.success("Please chack your email and create a new password");
    setTimeout(() => {
      navigate("/login")
  },3000);
   }).catch((error) => {
    toast.error(error.code);
});
  }
  return (
    <div className=' bg-lime-600 h-screen flex justify-center items-center'>
      <div className='bg-white w-96 p-7 rounded-xl text-center font-openSans font-bold text-2xl text-primary'>
        <h1>Forgot password ?</h1>
        <div className='relative mt-14'>
                <input type='email' onChange={(e)=>setEmail(e.target.value)}
                className='border-2 py-6 px-9 rounded-lg border-primary w-80 font-nunito font-semibold text-xl text-primary'/>
                <p className='absolute top-[-12px] left-14 bg-white px-5 font-nonito font-semibold text-sm text-primary'>Email Address</p>
         </div>
         <button type='submit' 
               className='bg-secondary hover:bg-primary transition-all hover:scale-110 py-3 px-3 inline-block text-white font-nunito font-regular text-sm mt-5 mr-3 rounded-xl'
           onClick={handelUpdatePass}    >Update Password</button>
         <Link to="/login" type='submit' 
               className='bg-secondary hover:bg-primary transition-all hover:scale-110 py-3 px-3 inline-block text-white font-nunito font-regular text-sm mt-5 rounded-xl'
               >Back to login</Link>
      </div>
      <ToastContainer position="top-center" theme="dark"/>
    </div>
  )
}

export default Forgetpass;
