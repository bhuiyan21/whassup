import React, { useState } from 'react'
import {RiEyeCloseFill, RiEyeFill} from 'react-icons/ri'
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification,updateProfile  } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Dna } from  'react-loader-spinner'
import { Link, useNavigate} from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
const Registration = () => {
  const db = getDatabase();
    const auth = getAuth();
    const navigate = useNavigate();
    let [email, setEmail] = useState("");
    let [fullName, setFullname] = useState("");
    let [password, setPassword] = useState("");
    let [emailErr, setEmailErr] = useState("");
    let [fullNameErr, setFullnameErr] = useState("");
    let [passwordErr, setPasswordErr] = useState("");
    let [passwordShow, setPasswordShow] = useState(true);
    let [loading, setLoading] = useState(true);

    let handelEmail = (e)=>{
        setEmail(e.target.value) 
        setEmailErr('')
    };
    let handelFullname = (e)=>{
          setFullname(e.target.value) 
          setFullnameErr('')
    };
    let handelPassword = (e)=>{
          setPassword(e.target.value) 
          setPasswordErr('')
    };
    let handelSubmit = ()=>{
      setLoading(true)
        if(!email){
            setEmailErr('Email is required')
        }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(email)){
            setEmailErr('Invalid Email !')
        }
        if(!fullName){
            setFullnameErr('Name is required')
        }
        if(!password){
            setPasswordErr('Password deee bedaa 😒')
        }
      if(email && fullName && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ){
        createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
            updateProfile(auth.currentUser, {
                displayName: fullName,
                photoURL: "./images/defaultprofile.png",
              }).then(() => {
                toast.success("Registration successfull. Please verify your email");
                setEmail("");
                setFullname("");
                setPassword("");
                sendEmailVerification(auth.currentUser);
                setLoading(false)
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
              }).then(()=>{
                set(ref(db, 'users/' + user.user.uid), {
                  username: user.user.displayName,
                  email: user.user.email,
                  profile_picture : user.user.photoURL
                });
              })
              .catch((error) => {
                console.log(error);
              });
        })
        .catch((error) => {
            if(error.code == ("auth/email-already-in-use")){
                setEmailErr("Email already in used")
            }              
        });
      }
    }
  return (
    <>
    <div className='flex justify-center'>
        <div className='md:w-1/2 lg:h-screen flex justify-end items-center m-4 lg:p-5 md:mt-24 md:mr-16 lg:mt-auto lg:ml-auto lg:mb-auto'>
            <div>
                <h1 className='text-primary font-nunito font-bold text-3xl md:text-4xl'>Get started with easily register</h1>
                <p className='font-nunito font-regular text-black text-xl pt-4'>Free register and you can enjoy it</p>
               <div className='relative mt-8 md:mt-14 w-full md:w-96'>
                <input type='email' 
                className='border-2 py-3 md:py-5 px-5 md:px-9 lg:py-3 rounded-lg border-primary w-full font-nunito font-semibold text-xl text-primary'
                onChange={handelEmail}
                value={email} />
                <p className='absolute top-[-12px] left-14 bg-white px-5 font-nonito font-semibold text-sm text-primary'>Email Address</p>
                <p className='absolute  py-2 px-3 text-red-600 font-bold'>{emailErr}</p>
               </div>
               <div className='relative mt-14 w-full md:w-96'>
                <input type='text' 
                className='border-2 py-3 md:py-5 px-5 md:px-9 lg:py-3 rounded-lg border-primary w-full font-nunito font-semibold text-xl text-primary'
                onChange={handelFullname}
                value={fullName}  />
                <p className='absolute top-[-12px] left-14 bg-white px-5 font-nonito font-semibold text-sm text-primary'>Full Name</p>
                <p className='absolute  py-2 px-3 text-red-600 font-bold'>{fullNameErr}</p>
               </div>
               <div className='relative mt-14 w-full md:w-96'>
                <input type={passwordShow ?"password" :"text"}
                className='border-2 py-3 md:py-5 px-5 md:px-9 lg:py-3 rounded-lg border-primary w-full font-nunito font-semibold text-xl text-primary'
                onChange={handelPassword}
                value={password} />
                {passwordShow ? <RiEyeCloseFill className='absolute top-5 md:top-7 lg:top-5 text-xl right-5 cursor-pointer' onClick={()=>setPasswordShow(!passwordShow)}/>
                 : <RiEyeFill className='absolute top-5 md:top-7 lg:top-5 text-xl right-5 cursor-pointer' onClick={()=>setPasswordShow(!passwordShow)}/>
                }
               
               
                <p className='absolute top-[-12px] left-14 bg-white px-5 font-nonito font-semibold text-sm text-primary'>Password</p>
                <p className='absolute  py-2 px-3 text-red-600 font-bold'>{passwordErr}</p>
               </div>
               {loading ?
               <div className='flex justify-center mt-10 md:mt-12 w-full md:w-96'>
               <button type='submit' 
               className='bg-secondary hover:bg-primary transition-all md:hover:scale-110 py-4 md:py-5 px-10 md:px-32  inline-block text-white font-nunito font-semibold text-xl rounded-3xl'
               onClick={handelSubmit}>Sign Up</button></div>:
               <div className='flex justify-center w-80 mt-14'>
                 <Dna
               visible={true}
               height="80"
               width="80"
               ariaLabel="dna-loading"
               wrapperStyle={{}}
               wrapperClass="dna-wrapper"
               />
               </div>}
               <p className='block mt-5 md:mt-9 text-sm font-normal font-openSans text-primary w-full md:w-96 text-center'>Already  have an account ?<Link to="/login" className='text-third font-semibold'>Sign In</Link></p>
               <ToastContainer position="top-center" theme="dark"/>
            </div>
        </div>
        <div className='w-1/2 hidden md:block'>
            <img src="images/registration.png" className='w-full h-screen object-cover'/>
        </div>
    </div>
    </>
  )
}

export default Registration
