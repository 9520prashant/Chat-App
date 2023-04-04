import {Box, Container, Input, Button, VStack, HStack} from "@chakra-ui/react"
import Message from "./Component/Message"
import {onAuthStateChanged,getAuth,GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth"
import {app} from "./firebase";
import { useEffect, useRef, useState } from "react";
import {getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore"


const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler=()=>{
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider);
};

 const logoutHandler=()=>{signOut(auth)}

 
function App() {
  const [user, setuser] = useState(false);
  const [message, setmessage] = useState("")
  const [messages, setmessages] = useState([]);
  const divForScroll = useRef(null)
  
  const sumbitHandler= async (e)=>{
    e.preventDefault();

    try {
      setmessage("");

      await addDoc(collection(db, "Messages"),{
        text:message,
        uid: user.uid,
        uri:user.photoURL,
        createdAt:serverTimestamp(),
      });
     

      
      divForScroll.current.scrollIntoView({behaviour:"smooth"})
      
    } catch (error) {
      alert(error)
    }
 }

  useEffect(()=>{
    const Q = query(collection(db, "Messages"), orderBy("createdAt", "asc"))
      const unsubscribe = onAuthStateChanged(auth, (data)=>{
       setuser(data)
      },[])

      const unsubscribeForMessage = onSnapshot(Q, (snap)=>{
        setmessages(snap.docs.map((item)=>{
            const id = item.id;
            return {id, ...item.data()};
          }));
      },[])
      
      return ()=>{
        unsubscribe();
        unsubscribeForMessage();
      };
  }, [])

  return (
     <Box bg={"red.50"}>
        {
          user?(
            <Container h={"100vh"} bg={"white"}>
          <VStack h={"full"} paddingY={"4"}>
             <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>Logout</Button>
             <VStack h="full" w={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
            display:"none"
          }}}>
              {
                messages.map((item)=>(
                  <Message 
                  key={item.id}
                  text={item.text}
                  uri={item.uri}
                  user={item.uid===user.uid?"me":"other"}
                  />
                ))
              }
             <div ref={divForScroll}></div>
             </VStack>
             <form onSubmit={sumbitHandler} style={{width:"100%"}}>
               <HStack>
                  <Input value={message} onChange={(e)=>setmessage(e.target.value)} placeholder="Enter a Message"/>
                  <Button colorScheme={"purple"} type="submit">Send</Button>
              </HStack>
             </form>
          </VStack>
        </Container>
          ):(
            <VStack justifyContent={"center"} height={"100vh"}>
            <Button onClick={loginHandler} colorScheme={"facebook"}>Sign in with Google</Button>
          </VStack>
          )
        }
     </Box>
  );
}

export default App;
