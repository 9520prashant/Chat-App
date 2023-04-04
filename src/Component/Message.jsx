import React from 'react';
import {HStack, Avatar, Text} from "@chakra-ui/react";


const Message = ({text, uri, user="other"}) => {
  const u = uri;
  // console.log(u);
  return (
    <>
       <HStack alignSelf={user==="me"?"flex-end":"flex-start"}  borderRadius={"base"} bg={"gray.100"} paddingY={"2"} paddingX={user === "me" ? "4" : "2"}>
            {
                user === "other" && <Avatar src={u}/>
            }
            <Text>{text}</Text>
            {
                user === "me" && <Avatar src={u}/>
            }
       </HStack> 
    </>
  )
}

export default Message
