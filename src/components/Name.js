import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, PinInput, PinInputField, Spacer, Text, useMediaQuery, useToast, VStack } from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import {motion} from 'framer-motion'
import $ from 'jquery'
import {socket} from "../service/socket";
export const Name = (props) =>{
    const [mobile] = useMediaQuery('(max-width: 800px)')
    const [creating, setCreating] = useState(false)
    const toast = useToast()
    const [joining, setJoining] = useState(false)
    useEffect(()=>{
        socket.on('serverEvent', (type, words) => {  
            if(type == 'sendWords'){
                console.log("words: "+words)
                props.setWords(words)
                props.setName($('#name').val())
            }
            
        })
    }, [])
    const submitForm = (e) =>{
        e.preventDefault()
        setCreating(true)
        console.log('e')
        socket.emit('clientEvent', 'joinRoom', {room: props.roomID, user: $('#name').val()})
        
        
    }
    return(
        <Flex width={'100vw'} height='100vh' justifyContent={'center'} alignItems={'center'}>
                <Box>
                <AnimatePresence  style={{width: '100%'}}>
                <motion.div transition={{delay: 1}} key='createRoom' initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}}>
                <VStack bg={'gray.900'} p='4' transition={'ease-in-out 0.5s all'} margin={'25px'} w={`${mobile ? '90vw' : '80vw'}`} rounded={'10px'}>
                    <Heading>Join</Heading>
                        <form onSubmit={submitForm} style={{width: '100%'}}>
                            <FormControl>
                                <FormLabel htmlFor='words'>Nickname</FormLabel>
                                <Input id='name' name="name" type='text' isRequired/>
                                <FormHelperText>Enter the name you want.</FormHelperText>
                                <HStack mt={'4'} >
                                    <Button type="submit" isLoading={creating} colorScheme="teal">Join</Button>
                                </HStack>
                            </FormControl>
                        </form>
                </VStack>
                </motion.div>
            </AnimatePresence>
            </Box>
        </Flex>
    )
}