import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Box, Button, SimpleGrid, Stack } from "@chakra-ui/core";
import { combatPlayerAttacking, combatPlayerFleeing, combatUseAbility } from "redux/combat/combat.actions";
import { CombatAbilities } from "features/combat/combatAbilities";
import { AbilityKey } from "data/abilities.consts";

export const CombatActions = () => {
  const dispatch = useDispatch();
  const [showAbilities, setShowAbilities] = useState(false);

  const useAbility = (abilityKey: AbilityKey) => {
    dispatch(combatUseAbility(abilityKey));
    setShowAbilities(false);
  };

  return (
    <Box>
      {!showAbilities && (
        <SimpleGrid columns={2} spacing={2}>
          <Button variant='outline' colorScheme='blue' onClick={() => dispatch(combatPlayerAttacking())}>Attack</Button>
          <Button variant='outline' colorScheme='blue'>Items</Button>
          <Button variant='outline' colorScheme='blue' onClick={() => dispatch(combatPlayerFleeing())}>Flee</Button>
          <Button variant='outline' colorScheme='blue' onClick={() => setShowAbilities(true)}>Abilities</Button>
        </SimpleGrid>
      )}
      {showAbilities && (
        <Stack spacing={4}>
          <CombatAbilities onUseAbility={useAbility}/>
          <Button onClick={() => setShowAbilities(false)}>Cancel</Button>
        </Stack>
      )}
    </Box>
  );
};
