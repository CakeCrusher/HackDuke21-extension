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
import { User } from "../types";

type Props = {
  user: User; 
};

const UserInfo: FunctionComponent<Props> = (props: Props) => {

  return (
    <Flex>
      User: {props.user.username}
      {/* Code for user goes here */}
    </Flex>
  )
};

export default UserInfo;
