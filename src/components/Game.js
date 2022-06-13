import { Box, Button, Grid, GridItem, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, propNames, SimpleGrid, Spacer, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {socket} from "../service/socket";
import Typist from 'react-typist';
import $ from 'jquery'
import { AnimatePresence } from "framer-motion";


const WordRow = (props) =>{
  const [answer, setAnswer] = useState([])
  useEffect(()=>{
    if (props.viewAnswer){
      var finalanswer = []
      console.log(props.userAnswer.toLowerCase())
      var useranswer = props.userAnswer.toLowerCase().split('')
      console.log(useranswer)
      var correctanswer = props.answer.toLowerCase().split('')
      var interated =  []
      for (let lettere in useranswer){
        var letter = useranswer[lettere]
        if (props.userAnswer.toLowerCase() == props.answer.toLowerCase()) {
          finalanswer.push({
            'status': 'correct',
            'letter': letter
          })
        } else if (interated.includes(letter)){
          console.log(letter)
          finalanswer.push({
            'status': 'unknown',
            'letter': letter
          })
        } else {
          interated.push(letter)
          if (correctanswer.includes(letter)){
            if(letter == correctanswer[lettere]){
              finalanswer.push({
                'status': 'correct',
                'letter': letter,
              })
            } else {
              finalanswer.push({
                'status': 'partial',
                'letter': letter,
              })
            }
          } else {
            finalanswer.push({
              'status': 'wrong',
              'letter': letter,
            })
          }
        }
      }
      if(props.userAnswer.toLowerCase() == props.answer.toLowerCase()){
        socket.emit('clientEvent', 'setWord', {room: props.roomID, word: props.answer})
      }
      setAnswer(finalanswer)
      console.log(answer)
    }
  }, [props.userAnswer])
  return(
    <>
      {answer.length != 0 ? 
      <>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'>
          <Box display={'flex'} justifyContent='center' alignItems={'center'} bg={`${answer[0].status == 'correct' ? 'green.500' : answer[0].status == 'partial'? 'yellow.500' : answer[0].status == 'wrong' ? 'gray.700': 'gray.700'}`} rounded={'md'} width={'50px'} height='50px'>
          <Heading textTransform={'uppercase'} fontSize={'40px'}>{answer[0].letter}</Heading>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent='center' alignItems={'center'} bg='gray.700' rounded={'md'} width={'50px'} height='50px'>
          <Box display={'flex'} justifyContent='center' alignItems={'center'} bg={`${answer[1].status == 'correct' ? 'green.500' : answer[1].status == 'partial'? 'yellow.500' : answer[0].status == 'wrong' ? 'gray.700': 'gray.700'}`} rounded={'md'} width={'50px'} height='50px'>
          <Heading textTransform={'uppercase'} fontSize={'40px'}>{answer[1].letter}</Heading>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent='center' alignItems={'center'} bg='gray.700' rounded={'md'} width={'50px'} height='50px'>
          <Box display={'flex'} justifyContent='center' alignItems={'center'} bg={`${answer[2].status == 'correct' ? 'green.500' : answer[2].status == 'partial'? 'yellow.500' : answer[0].status == 'wrong' ? 'gray.700': 'gray.700'}`} rounded={'md'} width={'50px'} height='50px'>
          <Heading textTransform={'uppercase'} fontSize={'40px'}>{answer[2].letter}</Heading>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent='center' alignItems={'center'} bg='gray.700' rounded={'md'} width={'50px'} height='50px'>
          <Box display={'flex'} justifyContent='center' alignItems={'center'} bg={`${answer[3].status == 'correct' ? 'green.500' : answer[3].status == 'partial'? 'yellow.500' : answer[0].status == 'wrong' ? 'gray.700': 'gray.700'}`} rounded={'md'} width={'50px'} height='50px'>
          <Heading textTransform={'uppercase'} fontSize={'40px'}>{answer[3].letter}</Heading>
          </Box>
        </Box>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'>
          <Box display={'flex'} justifyContent='center' alignItems={'center'} bg={`${answer[4].status == 'correct' ? 'green.500' : answer[4].status == 'partial'? 'yellow.500' : answer[0].status == 'wrong' ? 'gray.700': 'gray.700'}`} rounded={'md'} width={'50px'} height='50px'>
          <Heading textTransform={'uppercase'} fontSize={'40px'}>{answer[4].letter}</Heading>
          </Box>
        </Box>
      </>
      :
      <>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'></Box>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'></Box>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'></Box>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'></Box>
        <Box bg='gray.700' rounded={'md'} width={'50px'} height='50px'></Box>
      </>
    }
    </>
  )
}

export const Game = (props) => {
  const toast = useToast()
  const [isStart, setIsStart] = useState(false)
  const [gamePhase, setGamePhase] = useState(0)
  const [userWords, setuserWords] = useState([])
  const { isOpen: isPopen, onOpen: onPopen, onClose: onPclose } = useDisclosure()
  const [participants, setParticipants] = useState([])
  const [completed, setcompleted ] = useState(false)
  const [score, setscore] = useState(0)
  const [wordNumber, setWordNumber] = useState(0)
  const [transitionWord, setransitionWord] = useState(false)
  const [topScores, setTopScores] = useState([])
  const words = props.words
  console.log(words)
  const [word, setword] = useState('')
  useEffect(()=>{
    socket.on('serverEvent', (type, data) => {
      console.log('server event')
      if(type == 'startGame'){
        console.log('gameStart')
        setIsStart(true)
      } else if (type == 'userJoin'){
          console.log('lolel')
          const newParticipants = participants
          newParticipants.push({user: data.user, socket: data.socket})
          setParticipants(newParticipants)
          toast({
            title: 'New user!',
            description: `${data.user} just joined!`,
            status: 'info',
            isClosable: true
          })
        
      } else if (type == 'userKicked'){
        window.location.reload()
      } else if (type == 'setGamePhase'){
        setGamePhase(data.phase)
      } else if (type == 'setWord'){
        setword(data.word)
        setcompleted(true)
        setTimeout(()=>{
          console.log('transition')
          setransitionWord(true)
        }, 3000)
        setTimeout(()=>{
          setransitionWord(false)

        }, 6000)
      }
    })
  }, [])
  useEffect(()=>{
    if (transitionWord == true){
      setWordNumber((number) => number + 1)
      if (wordNumber + 1 == words.length){
        setGamePhase(2)
      } else {
        setcompleted(false)
        setuserWords([...[]])
        setword('')
      }
    }
  }, [transitionWord])
  return (
    <>
      <HStack bg='gray.700' position={'fixed'} w={'100%'} px={'4'} py={'1'} spacing={'5px'}>
        <Text fontWeight={700}>ID: {props.roomID}</Text>
        <Spacer/>
        {props.owner ? 
        <>
          <Tooltip label="Open chat">
            <Button variant={'ghost'} rounded={'100%'} fontSize={'20px'} height={'50px'} width={'50px'}><i className="far fa-comment-dots"/></Button>
          </Tooltip>
          <Tooltip label="Manage participants">
            <Button variant={'ghost'} rounded={'100%'} fontSize={'20px'} height={'50px'} width={'50px'}  onClick={onPopen}><i className="far fa-users"/></Button>
          </Tooltip>
          <Tooltip label="Configure game">
            <Button variant={'ghost'} rounded={'100%'} fontSize={'20px'} height={'50px'} width={'50px'}><i className="far fa-cog"/></Button>
          </Tooltip>
          <Tooltip label="Leave game">
            <Button variant={'ghost'} rounded={'100%'} colorScheme={'red'} fontSize={'20px'} height={'50px'} width={'50px'}><i className="far fa-sign-out"/></Button>
          </Tooltip>
        </>
        :
        <>
          <Tooltip label="Open chat">
            <Button variant={'ghost'} rounded={'100%'} fontSize={'20px'} height={'50px'} width={'50px'}><i className="far fa-comment-dots"/></Button>
          </Tooltip>
          <Tooltip label="View participants">
            <Button variant={'ghost'} rounded={'100%'} fontSize={'20px'} height={'50px'} width={'50px'} onClick={onPopen}><i className="far fa-users"/></Button>
          </Tooltip>
          <Tooltip label="Leave game">
            <Button variant={'ghost'} rounded={'100%'} colorScheme={'red'} fontSize={'20px'} height={'50px'} width={'50px'}><i className="far fa-sign-out"/></Button>
          </Tooltip>
        </>
        }
      </HStack>
      <Modal isOpen={isPopen} onClose={onPclose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Participants</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {participants.map((participant)=>{
              return <HStack p='2' bg={'transparent'} rounded='lg'>
                <Text fontSize={'20px'} fontWeight={700}>{participant.user}</Text>
                <Spacer/>
                <Tooltip label="Kick user" placement="top">
                  <Button variant={'ghost'} colorScheme='red' onClick={()=>{
                    socket.emit('clientEvent', 'kickUser', {socket: participant.socket, room: props.roomID})
                    
                    var filtered = participants.filter(function(value, index, arr){ 
                        return value.socket != participant.socket;
                    });
                    setParticipants(filtered)

                  }}><i className="far fa-user-slash"/></Button>
                </Tooltip>
              </HStack>
            })}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' variant={'ghost'} mr={3} onClick={onPclose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isStart ?
      gamePhase == 0 ?
      (
      <Box height={'100vh'} display={'flex'} width={'100vw'} justifyContent={'center'} alignItems='center' flexDir={'column'}>
        {!props.owner ? 
        <Heading>Look up the Host's screen!</Heading>
        :
        <>
        <Typist cursor={{show: false}} onTypingDone={()=>{
          setTimeout(()=>{
            socket.emit('clientEvent', 'setGamePhase', {phase: 1, room: props.roomID})
          }, 1000)
        }}>
          <Heading>
            Welcome to Wordy.
          </Heading>
          <Typist.Backspace count={17} delay={2000} />
          <Heading>
            Guess the 5 letter words.
          </Heading>
          <Typist.Backspace count={25} delay={3000} />
          <Heading>
            The first to guess the word wins!
          </Heading>
          <Typist.Backspace count={33} delay={4000} />
          <Heading>
            Good luck.
          </Heading>
          <Typist.Backspace count={10} delay={2000} />
        </Typist>
        </>
        }
      </Box>
      )
      :
      gamePhase == 1 ? (
      <Box height={'100vh'} display={'flex'} width={'100vw'} justifyContent={'center'} alignItems='center' flexDir={'column'}>
        {props.owner ? 
          transitionWord ?
          <Heading>Get ready for word {wordNumber + 1}!</Heading>
          :
          <SimpleGrid width={'300px'} columns={5} spacing={'10px'}>
            <WordRow viewAnswer={true} answer={word} userAnswer={word}/>
          </SimpleGrid>
          :
          completed | transitionWord?
          <Heading>Look up at the Host's screen!</Heading>
          :
          <SimpleGrid width={'300px'} columns={5} spacing={'10px'}>
              <WordRow addScore={()=> {setscore((e) => e + 1)}} roomID={props.roomID} viewAnswer={userWords[0]} answer={words[wordNumber]} userAnswer={userWords[0]}/>
              <WordRow addScore={()=> {setscore((e) => e + 1)}} roomID={props.roomID} viewAnswer={userWords[1]} answer={words[wordNumber]} userAnswer={userWords[1]}/>
              <WordRow addScore={()=> {setscore((e) => e + 1)}} roomID={props.roomID} viewAnswer={userWords[2]} answer={words[wordNumber]} userAnswer={userWords[2]}/>
              <WordRow addScore={()=> {setscore((e) => e + 1)}} roomID={props.roomID} viewAnswer={userWords[3]} answer={words[wordNumber]} userAnswer={userWords[3]}/>
              <WordRow addScore={()=> {setscore((e) => e + 1)}} roomID={props.roomID} viewAnswer={userWords[4]} answer={words[wordNumber]} userAnswer={userWords[4]}/>
              <WordRow addScore={()=> {setscore((e) => e + 1)}} roomID={props.roomID} viewAnswer={userWords[5]} answer={words[wordNumber]} userAnswer={userWords[5]}/>  
          </SimpleGrid>
        }
        {!props.owner &&
        !transitionWord && <HStack position={'fixed'} bottom='50px' spacing='20px' width={'90vw'}>
          <Input id="wordInput" placeHolder='Enter word here' borderRadius={'25px'} fontSize={'20px'} padding={'25px'} textTransform={'uppercase'} height={'55px'} width='100%'/>
          <Button onClick={()=>{
            $('#wordInput').val($('#wordInput').val().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''))
            if ($('#wordInput').val().length == 5){
              var userWordsToSubmit = userWords
              userWordsToSubmit.push($('#wordInput').val())
              setuserWords([...userWordsToSubmit])
            } else {
              toast({
                title: 'Bad request',
                description: 'Word must have exactly 5 letters!',
                status: 'warning',
                isClosable: true
              })
            }
            console.log(userWords)
          }} size={'lg'} colorScheme={'teal'}>Enter</Button>
        </HStack>
        }
      </Box>
      )
      : 
      gamePhase == 2 &&
      <Box height={'100vh'} display={'flex'} width={'100vw'} justifyContent={'center'} alignItems='center' flexDir={'column'}>
        {!props.owner ? 
        <Heading>Great job!</Heading>
        :
        <>
        <Heading>Congratulations for participating!</Heading>
        </>
        }
      </Box>
      :
      <Box height={'100vh'} display={'flex'} width={'100vw'} justifyContent={'center'} alignItems='center' flexDir={'column'}>
        {!props.owner ? 
        <Heading>Waiting for other players..</Heading>
        :
        <>
        <Heading>Share this code: {props.roomID}!</Heading>
        <Box bottom='0' bg={'gray.900'} textAlign='right' width={'100vw'} p='4' position='fixed'>
          <Button colorScheme={'teal'} size='lg' onClick={()=>{
            socket.emit('clientEvent', 'startGame', {room: props.roomID})
          }}>Start</Button>
        </Box>
        </>
        }
      </Box>
      }
    </>
  );
}