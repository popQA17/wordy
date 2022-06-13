import React, { useEffect, useState } from "react";
import { Box, Button, ChakraProvider, Heading, Text } from '@chakra-ui/react'
import $ from 'jquery'
import { Login } from "./components/login";
import { Game } from "./components/Game";
import { Name } from "./components/Name";
import { socket } from "./service/socket";
function App() {
  const [isGame, setIsGame] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [name, setName] = useState('')
  const [selectName, setSelectName] = useState(false)
  const [roomID, setRoomID] = useState('')
  const [words, setwords] = useState([])
  const [isDisconnect, setIsDisconnect] = useState(false)
  useEffect(()=>{
    console.log(roomID)
  }, [roomID])
  useEffect(()=>{
    socket.on('disconnect', ()=>{
      setIsDisconnect(true)
    }) 
    socket.on('connect', () =>{
      setIsDisconnect(false)
    })
  }, [])
  useEffect(()=>{
    if (localStorage.getItem('chakra-ui-color-mode') == 'light' | localStorage.getItem('chakra-ui-color-mode')== null){
      localStorage.setItem('chakra-ui-color-mode', 'dark')
      window.location.reload()
    }
  }, [])
  return (
    <ChakraProvider>
        <link href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css" rel="stylesheet"/>
      {isDisconnect &&
      <Box bg='gray.700' w={'100vw'} justifyContent={'center'} alignItems={'center'} height={'100vh'} flexDirection={'column'} position={'fixed'} top={0} left={0} display={'flex'} zIndex={100}>
        <i className="fad fa-wifi-slash" style={{fontSize: '150px'}}/>
        <Heading mt='4'>Offline</Heading>
        <Text>We're having troubles connecting you to our servers. Do not reload this page.</Text>
      </Box>
      }
      {isGame ? 
      <Game words={words} owner={isOwner} name={name} roomID={roomID} endGame={() => {
        setIsDisconnect(false)
        setIsOwner(false)
        setName('')
        setRoomID('')
        setSelectName(false); 
        setIsGame(false)}}/>
      :
      selectName ?
      <Name setWords={(word)=>{
        setwords(word)
      }} owner={isOwner} roomID={roomID} setName={(name) =>{
        setName(name)
        setIsGame(true)
      }}/>
      :
      <Login setWords={(word)=>{
        setwords(word)
      }} startGame={(owner, roomID) => {
        setIsOwner(owner)
        setRoomID(roomID)
        if (owner){
          setIsGame(true)
        } else {
          setSelectName(true)
        }
      }}/>
    }
    </ChakraProvider>
  );
}

export default App;