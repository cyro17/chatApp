import React, { useState } from 'react';
import {  motion } from "motion/react";
import ChatIcon from "../assets/chat.png"
import toast from 'react-hot-toast';
import { createRoomApi, joinChatApi } from '../services/RoomService';
import { useChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router';

export default function JoinCreateChat() {
    const [detail, setDetail] = useState({
        roomId: "",
        userName: ""
    })
    const { setConnected, setRoomId, setCurrentUser } = useChatContext();
    
    const navigate = useNavigate();

    function handleFormInputChange(event) {
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,
        });
    }
    
    function validateForm() {
        if (detail.roomId == "" || detail.userName == "") {
            toast.error("Invalid Input");
            return false;
        }
        return true;
    }

    async function handleJoinChat() {
        if (validateForm()) {
            try {
                const room = await joinChatApi(detail.roomId);
                console.log("room details : ", room);
                setRoomId(room.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate("/chat");
                
            } catch (error) {
                // console.log(error);
                if (error.response.status == 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error("Oops !! Looks like some error in joining room");
                }
                console.log(error);
            }    
        }
    }

    async function handleCreateRoom() {
        if (validateForm()) { 
            // cerate room
            // console.log(detail);
            // call api to create room on background
            try {
                const res = await createRoomApi(detail.roomId);
                // console.log(res);
                toast.success("Room created successfully !");

                setCurrentUser(detail.userName);
                setRoomId(res.roomId);
                setConnected(true);

                navigate("/chat")

            } catch (error) {
                // console.log(error);
                if (error.response.status == 400) {
                    toast.error("Room Id already exists.")
                } else {
                    toast.error("Error in creating room");
                }
                
            }
        }
    }


  return (
      <div className='min-h-screen flex justify-center items-center '>
          <div className='p-8 w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow-md '>
             
              <div>
                  <img src={ChatIcon} alt="chat app image"
                    className='w-24 mx-auto'
                  />
              </div>

              <h1 className='text-2xl font-semibold text-center'>
                  Join Room / Create Room
              </h1>
              <motion.div className='' whileHover={{
                  scale: 1.02, 
                  transition: {duration: 0.2}
              }}>
                  <label htmlFor="" className='text-start block font-medium mb-2'>Your Name</label>
                  <input
                      type="text"
                      id='name'
                      name='userName'
                      value={detail.userName}
                      onChange={handleFormInputChange}
                      placeholder='enter your user name'
                      className='w-full dark:bg-gray-600 px-4 py-2 border rounded-lg dark: border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
              </motion.div>

              <motion.div className='' whileHover={{
                  scale: 1.02, 
                  transition: {duration: 0.2}
              }}>
                  <label htmlFor="" className='text-start block font-medium mb-2'>
                      Room ID / New Room Id </label>
                  <input
                      type="text"
                      id='roomId'
                      name='roomId'
                      value={detail.roomId}
                      onChange={handleFormInputChange}
                      className='w-full dark:bg-gray-600 px-4 py-2 border rounded-lg dark: border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Enter Room Id'
                  />
              </motion.div>
              <div className='flex justify-center gap-4'>
                  <motion.button
                      type='submit'
                      onClick={handleJoinChat}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{scale: 1.1}}
                      className='px-3 py-2  text-white dark:bg-blue-500 dark:hover:bg-blue-900 rounded-full'
                  >
                      Join Room
                  </motion.button>
                  <motion.button 
                      whileTap={{ scale: 0.95 }}
                      whileHover={{scale: 1.1}}
                      className='px-3 py-2 text-white dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full'
                      onClick={handleCreateRoom}
                  >
                      Create Room
                  </motion.button>
              </div>
          </div>
      </div>
  )
}
