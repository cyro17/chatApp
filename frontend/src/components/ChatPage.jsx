import React, { useEffect, useRef, useState } from 'react';
import {motion} from "motion/react";
import { BiSend } from "react-icons/bi";
import { GrAttachment } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from 'react-router';
import { baseURL } from '../config/AxiosHelper';
import {  Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomService';

export default function ChatPage() {
    // const [messages, setMessages] = useState([
    //     {
    //         sender: "admin",
    //         content: "test message"
    //     },
    //     {
    //         sender: "cyro",
    //         content: "test message"
    //     },
    //     {
    //         sender: "sita",
    //         content: "test message"
    //     },
    //     {
    //         sender: "mohan",
    //         content: "test message"
    //     },
    //     {
    //         sender: "daniel",
    //         content: "test message"
    //     },
    //     {
    //         sender: "cyro",
    //         content: "test message"
    //     },
    // ]);
    const [messages, setMessages] = useState([]);
    const { roomId: room, currentUser, connected, 
        setConnected, setRoomId, setCurrentUser
     } = useChatContext();

    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompclient, setStompClient] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function loadMessages() {
            try {
                const {messages} = await getMessages(room);
                console.log(messages);
                setMessages(messages);
            } catch (error) {
                console.log(error);
            }
        }

        if (connected)
            loadMessages();
     }, [])

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight, 
                behavior: "smooth"
            })
        }
    })
    
    const sendMessage = async () => {
        if (stompclient && connected) 
            console.log(input);
        const message = {
            sender: currentUser,
            content: input,
            roomId: room
        };

        stompclient.send(
            `/app/sendMessage/${room}`, {}, JSON.stringify(message)
        );
        setInput("");
        
    }
    
    useEffect(() => {
        if (!connected)
            navigate("/");
    }, [room, currentUser, connected])


    useEffect(() => {

        const connectWebSocket = () => {
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);
      
            client.connect({}, () => {
              setStompClient(client);
      
              toast.success("connected");
      
              client.subscribe(`/topic/room/${room}`, (message) => {
                console.log(message);
      
                const newMessage = JSON.parse(message.body);
      
                setMessages((prev) => [...prev, newMessage]);
              });
            });
        };
        if (connected)
            connectWebSocket();
    }, [room]);

    
    const handleLogout = () => {
        stompclient.disconnect();
        setConnected(false);
        setCurrentUser("");
        setRoomId("");
        navigate("/");
    }

    return (
      
      <div className=''>
          <header className='absolute top-0 left-0 dark:border-gray-700 dark:bg-gray-900 
            py-4 px-2 shadow-md flex justify-between items-center w-full'>
              <div className=''>    
                    <h1 className=' text-xl font-semibold'>Room : { room}</h1>
              </div >
              <div className=''>
                    <h1 className='text-xl font-semibold'> User : { currentUser }</h1>
              </div>
              <div>
                  <motion.button
                      whileTap={{
                          scale: 0.95, 
                      }}
                      whileHover={{
                          scale: 1.02
                      }}
                        className='dark: bg-red-500 dark:hover:bg-red-700 rounded-full px-3 py-2 '
                      onClick={handleLogout}
                    >
                      Leave Room
                </motion.button>
              </div>
          </header>

            <main
                ref={chatBoxRef}
                className='py-20 px-5 dark:bg-gray-800 mx-auto h-screen mt-16 overflow-auto text-white rounded-md'>
                {messages?.map((message, index) => {
                  return ( 
                      <div
                          className={`flex 
                          ${message.sender == currentUser ?
                                  'justify-end' :
                                  'justify-start'}`
                          }>
                          <div key={index}
                              className={`max-w-4xl min-w-96 my-2 
                              ${message.sender == currentUser ?
                                      'bg-green-700' :
                                      'bg-indigo-700'
                                }
                                rounded-full`}>
                            <div className='flex flex-row items-center'>
                              <RxAvatar className='h-10 w-10'/>
                         
                                <div className=' flex flex-col gap-1'>
                                    <p className='text-left px-2 text-sm font-semibold'>{ message?.sender} </p>
                                    <p className='px-2'>{ message?.content} </p>
                                </div>
                            </div>
                        </div>
                  </div>)
              })}
          </main>
          

          <motion.div className='flex border fixed bottom-3 m-auto h-16 left-0 right-0 p-2 dark:border-gray-700
                 dark:bg-gray-900 w-2/3 items-start hover:cursor-text rounded-full'
              whileHover={{
                  scale: 1.03, 
                  borderColor: "#3b82f6"
              }}
          >
              <div className='h-full w-full flex gap-x-3 items-center text-left  mx-auto  ' >
                  <input
                      type='text'
                      name='input'  
                      value={input}
                      onChange={
                          (e) => setInput(e.target.value)
                      }
                      className='w-5/6 h-full dark:bg-gray-800 text-white rounded-full'
                      
                  />
                  
                  <motion.button 
                        whileTap={{ scale: 0.95 }}
                        whileHover={{scale: 1.1}}
                        className=' rounded-full px-4 py-2 dark:bg-purple-700 '
                    >
                      <GrAttachment className='w-7 h-7'/>
                    </motion.button>
                  <motion.button 
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.1 }}
                        className='px-3 py-2 w-12 h-12 text-white dark:bg-green-500 hover:dark:bg-green-800 rounded-full'
                        onClick={sendMessage}
                    >
                      <BiSend size={ 22 } />
                    </motion.button>
              </div>
              
          </motion.div>
    </div>
  )
}
