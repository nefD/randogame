import React from 'react';
import { Heading, Flex, Stack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Button, useColorModeValue } from '@chakra-ui/core';
import { Card } from "components/card";
import { getLocalStorageItem } from "utilities/sessionStorage.utilities";
import { SavedGame } from "models/saves";
import { useDispatch } from 'react-redux';
import LZString from 'lz-string';
import { loadState } from 'app/store';

export type LoadGameProps = {
  onClose: () => any,
}

export const LoadGame = (props: LoadGameProps) => {
  const dispatch = useDispatch();
  const savedGames = getLocalStorageItem<SavedGame[]>('savedGames', []);

  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: true,
    onClose: () => {
      props.onClose();
    },
  });

  console.log(`isOpen: ${isOpen}`);

  const saveBg = useColorModeValue("white", "gray.600");

  const renderSaveTitle = (save: SavedGame) => {
    const info = save.characterInfo;
    return `${info.name} the level ${info.level} ${info.race} ${info.class}`;
  };

  const loadSavedGame = (saveIndex: number) => {
    const savedGames = getLocalStorageItem<SavedGame[]>('savedGames', []);
    if (!savedGames.length || !savedGames[saveIndex]) return;
    const saveText = savedGames[saveIndex];
    const stateText = LZString.decompress(saveText.compressedData);
    const stateObj = JSON.parse(stateText || '');
    dispatch(loadState(stateObj));
    onClose();
  };

  return (
    <Card>
      <Flex
        minW="500px"
        w="80vw"
        p={4}
        justify="center"
        align="stretch"
        direction="column"
      >
        <Stack spacing={8}>
          <Heading>Load Game</Heading>

          <Stack spacing={4} flex='1'>
            {savedGames.map((save, idx) =>
              <Stack
                spacing={4}
                key={idx}
                direction='row'
                bg={saveBg}
                p={2}
                align='center'
              >
                <Box flex="1">
                  <Box>{renderSaveTitle(save)}</Box>
                </Box>

                <Box>{new Date(save.creationDate).toLocaleString()}</Box>

                <Button onClick={() => loadSavedGame(idx)} colorScheme='teal'>Load</Button>
              </Stack>
            )}
          </Stack>

          <Box textAlign='right'>
            <Button colorScheme='red' onClick={() => onClose()}>Cancel</Button>
          </Box>
        </Stack>
      </Flex>
    </Card>
  );
};
