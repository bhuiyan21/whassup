import React, {useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../component/Sidebar'
import {useNavigate} from 'react-router';
const Notification = () => {
  const navigate = useNavigate();
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  useEffect(()=>{
    if(!data){
     navigate("/login")
    }
 },[]);
  return (
    <div>
        <Sidebar active="noti"/>
      Notification
    </div>
  )
}

export default Notification
