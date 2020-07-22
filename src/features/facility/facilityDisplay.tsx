import {
  Box,
  Button,
  Flex,
  Stack,
} from '@chakra-ui/core';
import React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { playerLeavingFacility } from 'redux/character/character.slice';
import { getPlayersCurrentFacility } from 'redux/mapAreas/mapAreas.selectors';
import "./facilityDisplay.scss";
import { FACILITY_TYPE } from 'data/areas.consts';
import { TavernDisplay } from 'features/facility/tavernDisplay';
import { InnDisplay } from 'features/facility/innDisplay';
import { ShopDisplay } from 'features/facility/shopDisplay';

export const FacilityDisplay = () => {
  const dispatch = useDispatch();

  const facility = useSelector(getPlayersCurrentFacility);

  let facilityContent;
  switch (facility?.type) {
    case FACILITY_TYPE.Tavern: facilityContent = (<TavernDisplay />); break;
    case FACILITY_TYPE.Inn: facilityContent = (<InnDisplay />); break;
    case FACILITY_TYPE.Shop: facilityContent = (<ShopDisplay />); break;
  }

  return (
    <Stack p={2} spacing={4} bg="panelBackground" borderWidth="1px">
      <Box>{facilityContent}</Box>

      <Flex direction="row" justify="center">
        <Button onClick={() => dispatch(playerLeavingFacility())}>Leave</Button>
      </Flex>
    </Stack>
  );
};
