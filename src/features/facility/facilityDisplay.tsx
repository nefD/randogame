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
import { TavernDisplay } from 'features/facility/tavernDisplay';
import { InnDisplay } from 'features/facility/innDisplay';
import { ShopDisplay } from 'features/facility/shopDisplay';
import { Card } from 'components/card';
import { FACILITY_KEYS } from "data/facilities.consts";

export const FacilityDisplay = () => {
  const dispatch = useDispatch();
  const facility = useSelector(getPlayersCurrentFacility);

  let facilityContent;
  switch (facility?.key) {
    case FACILITY_KEYS.Tavern: facilityContent = (<TavernDisplay />); break;
    case FACILITY_KEYS.Inn: facilityContent = (<InnDisplay />); break;
    case FACILITY_KEYS.Shop: facilityContent = (<ShopDisplay />); break;
  }

  return (
    <Card>
    <Stack p={2} spacing={4}>
      <Box>{facilityContent}</Box>
      <Flex direction="row" justify="center">
        <Button onClick={() => dispatch(playerLeavingFacility())}>Leave</Button>
      </Flex>
    </Stack>
    </Card>
  );
};
