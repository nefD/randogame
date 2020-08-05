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
  const [messages, setMessages] = useLocalStorage<Message[]>('gameMessages', []);

  return (
    <Box>
      <Flex direction="row" justify='flex-end'>
        <Button size='sm' onClick={() => clearGameMessages()}>Clear</Button>
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
