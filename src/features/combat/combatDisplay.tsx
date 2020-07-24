import React from 'react';
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
  combatPlayerFleeing,
} from 'redux/combat/combat.actions';

export const CombatDisplay = () => {
  const dispatch = useDispatch();

  const player = useSelector(getCharacterObject);
  const enemy = useSelector(getPlayerCombatEnemy);

  const playerHealthBar = (
    <Progress value={enemy ? ((player.stats.health / player.stats.healthMax) * 100) : 0} />
  );

  const enemyHealthBar = (
    <Progress value={enemy ? ((enemy?.health / enemy?.maxHealth) * 100) : 0} />
  );

  return (
    <Stack className="combatContainer" p={2}>
      <Box color='white'>
        {enemy?.name}
        {enemyHealthBar}
      </Box>

      <Divider />

      <Box color='white'>
        {player?.name}
        {playerHealthBar}
      </Box>

      <Divider />

      <Box>
        <SimpleGrid columns={2} spacing={2}>
          <Button onClick={() => dispatch(combatPlayerAttacking())}>Attack</Button>
          <Button>Items</Button>
          <Button onClick={() => dispatch(combatPlayerFleeing())}>Flee</Button>
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
