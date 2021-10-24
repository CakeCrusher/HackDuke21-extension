import React, { FunctionComponent, useEffect, useState } from "react";
import { Flex, Text, Icon, Button } from "@chakra-ui/react";
import {RiLightbulbFlashFill, RiFlashlightFill} from 'react-icons/ri';
import "../App.css";
import LoginForm from "./LoginForm";
import UserInfo from "./UserInfo";
import { ChromeMessage, Message, Sender, User } from "../types";

// type AppProps = {
//   color: string;
//   title: string;
//   description: string;
//   icon: any;
//   children: any;
//   activated: boolean;
//   setActivated: (state: boolean) => void;
// };

const AppContainer: FunctionComponent = (props) => {
  const [user, setUser] = useState<User|null>(null);
  useEffect(() => {
    chrome.storage.sync.get(["user"], (res) => {
      if (res.user) {
        console.log("user", res.user);
        
        setUser(res.user);
      }
    })
  }, [])

  const onNavigateToQuiz = () => {
    console.log("navigating to quiz");
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const message: ChromeMessage = {
        from: Sender.React,
        message: Message.NAVIGATE_TO_QUIZ,
      };
      if (tabs && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    })
  }

  const onChangeUser = () => {
    const customUser: User = {
      username: "CakeCrusher",
      password: "secret",
      points: [
        {
          points: 10,
          article: "tiny.url/1",
          topic: "number"
        },
        {
          points: 55,
          article: "tiny.url/one",
          topic: "text"
        },
      ]

    }
    if (user) {
      chrome.storage.sync.set({user: null})
    } else {
      chrome.storage.sync.set({user: customUser})
    }
  }
  const onSetUser = () => {
    chrome.storage.sync.get(["user"], (res) => {
      setUser(res.user);
    })
  }
  // create a Flex component that shows the BsFillBookFill in Icon  with a title on the right side

  return (
    <Flex
      direction="column"
    >
      <Flex
        direction="row"
        align="center"
        justify="center"
        w="100%"
      >
        <Icon
          as={RiLightbulbFlashFill}
          h="8"
          w="8"
          m="1"
          color="white"
        />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="white"
        >Wisdom</Text>
      </Flex>
      {user ? <UserInfo user={user} /> : <LoginForm />}
      <Button
        colorScheme="blue"
        m="2"
        onClick={onNavigateToQuiz}
      >Navigate to quiz</Button>
      <Button
        colorScheme="blue"
        onClick={onChangeUser}
      >Change User</Button>
      <Button
        colorScheme="blue"
        onClick={onSetUser}
      >Set User</Button>
    </Flex>
  )
};

export default AppContainer;
