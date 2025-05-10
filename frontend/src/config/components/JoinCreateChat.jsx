import React from 'react';
import { motion } from "motion/react";
import ChatIcon from "../../assets/chat.png"

export default function JoinCreateChat() {
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
                      className='w-full dark:bg-gray-600 px-4 py-2 border rounded-lg dark: border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
              </motion.div>
              <div className='flex justify-center gap-4'>
                  <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{scale: 1.1}}
                      className='px-3 py-2  text-white dark:bg-blue-500 dark:hover:bg-blue-900 rounded-full'>
                      Join Room
                  </motion.button>
                  <motion.button 
                      whileTap={{ scale: 0.95 }}
                      whileHover={{scale: 1.1}}
                      className='px-3 py-2 text-white dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full'
                  >
                      Create Room
                  </motion.button>
              </div>
          </div>
      </div>
  )
}
