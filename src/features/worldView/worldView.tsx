import React from 'react';
import { getPlayerGameState } from "redux/character/character.selectors";
import { CharacterGameState } from "models/character";
import { Card } from "components/card";
import { MapDisplay } from "features/map/mapDisplay";
import { MapNavigation } from "features/map/mapNavigation";
import { AreaCellDisplay } from "features/areaCell/areaCellDisplay";
import { Stack, Box, Flex } from '@chakra-ui/core';
import { useSelector } from 'react-redux';
import { CombatDisplay } from "features/combat/combatDisplay";
import { FacilityDisplay } from "features/facility/facilityDisplay";

export const WorldView = () => {
  const playerGameState = useSelector(getPlayerGameState);
  const showTravel = playerGameState === CharacterGameState.Travel;
  const showCombat = playerGameState === CharacterGameState.Combat;
  const showFacility = playerGameState === CharacterGameState.Facility;

  return (
    <Box>
      {showTravel &&
        <Stack direction="row" spacing={4}>
          <Card>
            <MapDisplay/>
            <MapNavigation/>
          </Card>
          <Box flex="1"><AreaCellDisplay/></Box>
        </Stack>
      }
      {showCombat &&
        <Card>
          <Flex direction="row"><Box flex="1"><CombatDisplay/></Box></Flex>
        </Card>
      }
      {showFacility &&
        <Flex direction="row"><Box flex="1"><FacilityDisplay/></Box></Flex>
      }
    </Box>
  );
}
