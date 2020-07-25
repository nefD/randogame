import React from 'react';
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
import { getMessages } from 'redux/messages/messages.selectors';
import { clearMessages } from 'redux/messages/messages.slice';

export function MessagesDisplay() {
  const dispatch = useDispatch();
  const messages = useSelector(getMessages);

  return (
    <Box>
      <Flex direction="row" borderBottomWidth="1px" align="center">
        <Box flex="1">Message Log</Box>
        <Button onClick={() => dispatch(clearMessages())}>Clear</Button>
      </Flex>

      <Flex direction="column-reverse" overflowY="auto">
        <Stack spacing={1}>
          {messages.map((message, i) =>
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
