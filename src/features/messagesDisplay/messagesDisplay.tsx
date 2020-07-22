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
    <Box bg="panelBackground" borderWidth="1px" borderTop="none">
      <Flex direction="row" p={2} borderBottomWidth="1px" align="center">
        <Box flex="1" color="white">Message Log</Box>
        <Button size="sm" onClick={() => dispatch(clearMessages())}>Clear</Button>
      </Flex>

      <Flex p={4} direction="column-reverse" h="20vh" overflowY="auto">
        <Stack spacing={1}>
          {messages.map((message, i) =>
            <Flex key={i} color="white">
              {message.timestamp &&
                <Box marginRight={2} color="grey">{`[${message.timestamp}] `}</Box>
              }
              <Box>{message.content}</Box>
            </Flex>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
