import React, { useState } from 'react';
import 'features/combat/combatDisplay.scss'
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Box,
  Button,
  Divider,
  Progress,
  SimpleGrid,
  Stack,
} from '@chakra-ui/core';
import {
  getCharacterObject,
  getPlayerCombatEnemy,
} from 'redux/character/character.selectors';
import {
  combatPlayerAttacking,
  combatPlayerFleeing, combatUseAbility,
} from 'redux/combat/combat.actions';
import { CombatAbilities } from "features/combat/combatAbilities";
import { AbilityKey } from "data/abilities.consts";

export const CombatDisplay = () => {
  const dispatch = useDispatch();

  const [showAbilities, setShowAbilities] = useState(false);
  const player = useSelector(getCharacterObject);
  const enemy = useSelector(getPlayerCombatEnemy);

  const playerHealthBar = <Progress value={enemy ? ((player.stats.health / player.stats.healthMax) * 100) : 0} />;
  const enemyHealthBar = <Progress value={enemy ? ((enemy?.health / enemy?.maxHealth) * 100) : 0} />;

  const useAbility = (abilityKey: AbilityKey) => {
    dispatch(combatUseAbility(abilityKey));
    setShowAbilities(false);
  };

  return (
    <Stack className="combatContainer" p={2}>
      <Box>
        {enemy?.name}
        {enemyHealthBar}
      </Box>

      <Divider />

      <Box>
        {player?.name}
        {playerHealthBar}
      </Box>

      <Divider />

      <Box>
        {!showAbilities && (
          <SimpleGrid columns={2} spacing={2}>
            <Button onClick={() => dispatch(combatPlayerAttacking())}>Attack</Button>
            <Button>Items</Button>
            <Button onClick={() => dispatch(combatPlayerFleeing())}>Flee</Button>
            <Button onClick={() => setShowAbilities(true)}>Abilities</Button>
          </SimpleGrid>
        )}
        {showAbilities && (
          <Box>
            <CombatAbilities onUseAbility={useAbility}/>
            <Button onClick={() => setShowAbilities(false)}>Cancel</Button>
          </Box>
        )}
      </Box>
    </Stack>
  );
}
