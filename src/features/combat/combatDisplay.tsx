import React from 'react';
import 'features/combat/combatDisplay.scss'
import {
  Divider,
  Stack,
} from '@chakra-ui/core';
import { CombatActions } from "features/combat/combatActions";
import { Combatants } from "features/combat/combatants";

export const CombatDisplay = () => {
  return (
    <Stack spacing={8} p={2}>
      <Combatants/>
      <CombatActions/>
    </Stack>
  );
}
