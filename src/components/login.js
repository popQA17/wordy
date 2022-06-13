import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, PinInput, PinInputField, Spacer, Text, useMediaQuery, useToast, VStack } from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import {motion} from 'framer-motion'
import $ from 'jquery'
import {socket} from "../service/socket";
export const Login = (props) =>{
    const [mobile] = useMediaQuery('(max-width: 800px)')
    const [creating, setCreating] = useState(false)
    const [words, setwords] = useState('')
    const toast = useToast()
    const [joining, setJoining] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    useEffect(()=>{
        socket.on('joinStatus', (status, roomID) => {  
            if(status == 'OK'){
                props.startGame(false, roomID)
            } else if (status == 'ROOM_INVALID'){
                toast({
                    title: 'Joining failed!',
                    description: "That room doesn't exist.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                setJoining(false)
            }
        })
    }, [])
    const submitForm = (e) =>{
        e.preventDefault()
        setCreating(true)
        $.ajax({
            url: 'https://api.wordy.popplays.tk/room/add',
            type: 'POST',
            data: $('form').serialize()
        }).then((res) => {
            if(res.result == 'OK'){
                toast({
                    title: 'Room created!',
                    description: "Your room id: "+res.id,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
                socket.emit('clientEvent', 'joinRoom', {room: res.id, user: 'Host'})
                props.setWords(res.words)
                props.startGame(true, res.id)
            } else if (res.result == 'WORD_INVALID'){
                toast({
                    title: 'Creation failed!',
                    description: "Your word is not an english word, or has more or less than 5 letters.",
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                })
                setCreating(false)
            }
        }).catch((e) =>{
            console.log(e)
            toast({
                title: 'Creation failed!',
                description: "An unknown error occured in your room creation.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setCreating(false)
        })
        
    }
    return(
        <Flex width={'100vw'} height='100vh' justifyContent={'center'} alignItems={'center'}>
                <Box>
                <AnimatePresence  style={{width: '100%'}}>
                {!showCreateForm ?
                <motion.div key='joinDivider' exit={{opacity: 0, y: -100}}>
                    <HStack flexWrap={'wrap'}  paddingX={mobile ? '10px' : '30px'}>
                    <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}}>
                    <VStack bg={'teal.500'} p='4' margin={'25px'} w='300px' rounded={'10px'}>
                        <Box>
                            <Heading>Join room</Heading>
                            <Text>Enter your 6 digit room pin!</Text>
                        </Box>
                        <HStack>
                            <PinInput disabled={joining} placeholder="" variant={'filled'} autoFocus size='md' type={'alphanumeric'} onComplete={(e) =>{
                                setJoining(true)
                                socket.emit('joinRoom', e) 

                            }}>                                
                                <PinInputField bg={'teal.400'}/>
                                <PinInputField bg={'teal.400'}/>
                                <PinInputField bg={'teal.400'}/>
                                <PinInputField bg={'teal.400'}/>
                                <PinInputField bg={'teal.400'}/>
                                <PinInputField bg={'teal.400'}/>

                            </PinInput>
                        </HStack>
                    </VStack>
                    </motion.div>
                    <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}}>
                    <VStack bg={'gray.900'} p='4' transition={'ease-in-out 0.5s all'} margin={'25px'} w={`300px`} rounded={'10px'}>
                        <Heading>Create</Heading>
                            <Button disabled={joining} onClick={() => {setShowCreateForm(true)}}>Create new room</Button>                
                    </VStack>
                    </motion.div>
                </HStack>
                </motion.div>
                : 
                <motion.div transition={{delay: 1}} key='createRoom' initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}}>
                <VStack bg={'gray.900'} p='4' transition={'ease-in-out 0.5s all'} margin={'25px'} w={`${mobile ? '90vw' : '80vw'}`} rounded={'10px'}>
                    <Heading>Create</Heading>
                        <form onSubmit={submitForm} style={{width: '100%'}}>
                            <FormControl>
                                <FormLabel htmlFor='words'>Words</FormLabel>
                                <Input value={words} onChange={(e)=>{setwords(e.value)}} id='words' name="words" type='text' isRequired/>
                                <FormHelperText>Enter the words you want.</FormHelperText>
                                <HStack mt={'4'} >
                                    <Button type="submit" isLoading={creating} colorScheme="teal">Create</Button>
                                    <Button type='button' disabled={creating} onClick={() => setShowCreateForm(false)}>Cancel</Button>
                                </HStack>
                            </FormControl>
                        </form>
                </VStack>
                </motion.div>
                }
            </AnimatePresence>
            </Box>
        </Flex>
    )
}