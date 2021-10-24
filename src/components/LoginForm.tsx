import React, { FunctionComponent, useState } from "react";
import {
  Flex,
  Text,
  Icon,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import {AiFillBook} from 'react-icons/ai';
import "../App.css";
import {Formik, Form, Field, ErrorMessage} from 'formik';

// type AppProps = {
//   color: string;
//   title: string;
//   description: string;
//   icon: any;
//   children: any;
//   activated: boolean;
//   setActivated: (state: boolean) => void;
// };

const LoginForm: FunctionComponent = (props) => {

  return (
    <Flex>
      Login
      {/* Register and Login code goes here */}
    </Flex>
  )
};

export default LoginForm;
