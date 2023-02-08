import React, { useState } from 'react'
import {RiEyeCloseFill, RiEyeFill} from 'react-icons/ri'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,updateProfile } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Link,useNavigate } from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import { userLoginInfo } from '../../slices/userInfo/userSlice';
import { getDatabase, ref, set } from "firebase/database";
const Login = () => {
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  const db = getDatabase();
  const auth = getAuth();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch()
  let [email, setEmail] = useState("");
  let [emailErr, setEmailErr] = useState("");
  let [password, setPassword] = useState("");
  let [passwordErr, setPasswordErr] = useState("");
  let [forgetPass, setForgetPass] = useState("");
  let [passwordShow, setPasswordShow] = useState(true);
  let [clickNumber, setClickNumber] = useState(0);
  let handelEmail =(e)=>{
       setEmail(e.target.value);
       setEmailErr('')
  };
  let handelPassword = (e)=>{
    setPassword(e.target.value);
    setPasswordErr('')
  };
  let handelSubmit = ()=>{
    if(!email){
      setEmailErr('Email is required');
    }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(email)){
      setEmailErr('Invalid Email !')
  };
  if(!password){
     setPasswordErr('Password if required')
  };
  if(email && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(email)){
    signInWithEmailAndPassword(auth, email, password).then((user)=>{
      toast.success("Log In successfull.");
            setEmail("");
            setPassword("");
            dispatch(userLoginInfo(user.user))
            localStorage.setItem("userInfo", JSON.stringify(user))
            setTimeout(() => {
                navigate("/")
            }, 2000);
    })
    .catch((error)=>{
      if(error.code.includes('auth/user-not-found')){
        setEmailErr("Email not found")
      }if(error.code.includes('auth/wrong-password') || error.code.includes('auth/too-many-requests')){
        clickNumber++
        setPasswordErr("Incorrect password")
        if(clickNumber == 2){
          setForgetPass('Forgot Password?')
        }
      }
    })
  }
  }
  let handelGoogleSignIn = ()=>{
    signInWithPopup(auth, provider).then((user)=>{
      updateProfile(auth.currentUser, {
        photoURL: "./images/defaultprofile.png",
      }).then(()=>{
        set(ref(db, 'users/' + user.user.uid), {
          username: user.user.displayName,
          email: user.user.email,
          profile_picture : user.user.photoURL
        })
        if(data.emailVerified){
          navigate("/")
        }else{
          navigate("/login")
        }
      });
    })
  }
  return (
    <div className='flex'>
        <div className='w-1/2 flex justify-end mt-56 mr-44'>
            <div>
                <h1 className='text-primary font-nunito font-bold text-4xl'>Login to your account!</h1>
                <img className='mt-7 cursor-pointer' src='./images/google.png' onClick={handelGoogleSignIn}/>
               <div className='relative mt-14'>
                <input type='email' 
                className='border-b-2 py-4 px-2 border-primary w-80 font-nunito font-semibold text-xl text-primary focus:outline-none'
                onChange={handelEmail} />
                <p className='absolute bottom-full left-0 font-nonito font-semibold text-sm text-primary'>Email Address</p>
                <p className='absolute text-red-600 font-bold'>{emailErr}</p>
               </div>
               <div className='relative mt-14 w-80'>
               <input type={passwordShow ?"password" :"text"}
                className='border-b-2 py-6 px-2 border-primary w-full font-nunito font-semibold text-xl text-primary focus:outline-none'
                onChange={handelPassword}
                value={password} />
                {passwordShow ? <RiEyeCloseFill className='absolute top-8 text-xl right-5 cursor-pointer' onClick={()=>setPasswordShow(!passwordShow)}/>
                 : <RiEyeFill className='absolute top-8 text-xl right-5 cursor-pointer' onClick={()=>setPasswordShow(!passwordShow)}/>
                }
                <p className='absolute bottom-full left-0 font-nonito font-semibold text-sm text-primary'>Password</p>
                <p className='absolute text-red-600 font-bold'>{passwordErr}</p>
               </div>
               <Link to="/forgetpassword" className='block ml-3 mt-9 text-xl font-semibold font-openSans text-third animate-bounce'>{forgetPass}</Link>
               <p className='block ml-3 mt-9 text-sm font-normal font-openSans text-primary '>Don’t have an account ?<Link to="/registration" className='text-third font-semibold'>Sign up</Link></p>
               <button type='submit' 
               className='bg-secondary hover:bg-primary transition-all hover:scale-110 py-5 inline-block text-white font-nunito font-semibold text-xl px-32 mt-14 rounded-3xl'
               onClick={handelSubmit} >Login to Continue</button>
               <ToastContainer position="top-center" theme="dark"/>
            </div>
        </div>
        <div className='w-1/2'>
            <img src="images/login.png" className='w-full h-screen object-cover'/>
        </div>
    </div>
  )
}
export default Login;
