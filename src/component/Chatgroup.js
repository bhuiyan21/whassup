import React, { useEffect, useState } from 'react'
import { FcSearch} from 'react-icons/fc';
import { useSelector, useDispatch } from 'react-redux';
import { getDatabase, ref, onValue, set,push , remove} from "firebase/database";
import { activeChat } from '../slices/userInfo/activeChatSlice';
const Chatgroup = () => {
    const dispatch = useDispatch()
    const db = getDatabase();
    let data = useSelector((state)=>state.userLoginInfo.userInfo);
    let [grouplist, setGroupList] = useState([]);
    let [groupMember, setGroupMember] = useState([]);
    let [filterGroup, setFilterGroup] = useState([])
    useEffect(()=>{
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                    arr.push({...item.val(), key: item.key,});   
            });
            setGroupList(arr);
        });
    },[]);
   useEffect(()=>{
    const groupmembersRef = ref(db, 'groupmembers/');
    onValue(groupmembersRef, (snapshot) => {
       let arr = [];
        snapshot.forEach((item)=>{
                arr.push(item.val().reqid, item.val().groupAdminId);
        });
        setGroupMember(arr);
    });
   },[])
    let handelSearch =(e)=>{
        let arr = [];
        if(e.target.value.length == 0){
            setFilterGroup([])
        }else{
            grouplist.filter((item)=>{           
              if(item.groupName.toLowerCase().includes(e.target.value.toLowerCase())){
                  arr.push(item)
              }
              setFilterGroup(arr)
            })
      }         
    };
    let handelGmsg =(item)=>{
        console.log("gmsg",item);
        dispatch(activeChat({status: "groupmsg", name: item.groupName, gid: item.key}))
        localStorage.setItem("activeSingle", JSON.stringify({status: "groupmsg", name: item.groupName, gid: item.key}))
    }
  return (
    <div className='pt-5 pb-5 pl-5 shadow-md mt-6 rounded-lg relative bg-white'>
      <div className='flex justify-between pr-8 items-center'>
            <h2 className='text-sm font-poppins font-semibold text-black'>Let's talk with group members</h2>
            <div className='flex items-center shadow-md px-2'>
                <input type="text" placeholder="Search" className='outline-none rounded-lg text-shadow font-semibold text-lg'
                onChange={handelSearch} />
                <FcSearch className='text-2xl cursor-pointer text-secondar'/>
            </div>
        </div>
        <div className='h-[650px] overflow-y-scroll pr-6'>
             {
                grouplist.map((item)=>(
                    groupMember.length > 0
                    ?
                    groupMember.includes(data.uid) &&
                    <div onClick={()=>handelGmsg(item)} className='flex py-4 border-b-2 items-center'>
                    <div className='mr-4 w-[52px] h-[54px]'>
                    <img src='./images/friendreq-one.png'/>
                    </div>
                        <div>
                            <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                            <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                            <p className='font-medium font-poppins text-xs text-shadow mt-2'>Admin :{item.groupAdminName}</p>
                        </div>
                        <div className='mt-2 ml-auto'>
                            <p className='font-poppins font-medium text-xs text-shadow'>Today, 8:56pm</p>
                        </div>
                     </div>
                   : data.uid === item.groupAdminId && 
                    <div onClick={()=>handelGmsg(item)} className='flex py-4 border-b-2 items-center'>
                    <div className='mr-4 w-[52px] h-[54px]'>
                    <img src='./images/friendreq-one.png'/>
                    </div>
                    <div>
                        <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                        <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                        <p className='font-medium font-poppins text-xs text-shadow mt-2'>Admin :{item.groupAdminName}</p>
                    </div>
                    <div className='mt-2 ml-auto'>
                         <p className='font-poppins font-medium text-xs text-shadow'>Today, 8:56pm</p>
                    </div>
                </div>
                ))
             }              
        </div>
    </div>
  )
}
export default Chatgroup