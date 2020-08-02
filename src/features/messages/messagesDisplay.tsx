import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Stack,
} from '@chakra-ui/core';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { writeStorage, deleteFromStorage, useLocalStorage } from '@rehooks/local-storage';
import { clearGameMessages } from "utilities/messages.utilities";
import { Message } from "models/messages";

export function MessagesDisplay() {
  // const dispatch = useDispatch();
  // const messages = useSelector(getMessages);

  const [messages, setMessages] = useLocalStorage<Message[]>('gameMessages', []);

  console.log(`session messages:`, messages);

  return (
    <Box>
      <Flex direction="row" borderBottomWidth="1px" align="center">
        <Box flex="1">Message Log</Box>
        <Button onClick={() => clearGameMessages()}>Clear</Button>
      </Flex>

      <Flex direction="column-reverse" overflowY="auto">
        <Stack spacing={1}>
          {(messages || []).map((message, i) =>
            <Flex key={i} direction='row'>
              {message.timestamp &&
                <Box marginRight={2}>{`[${message.timestamp}] `}</Box>
              }
              <Box>{message.content}</Box>
            </Flex>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
