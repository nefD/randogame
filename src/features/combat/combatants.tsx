import React from 'react';
import { Box, Divider, Progress } from "@chakra-ui/core";
import { useSelector } from "react-redux";
import { getCharacterObject, getPlayerCombatEnemy } from "redux/character/character.selectors";

export const Combatants = () => {
  const player = useSelector(getCharacterObject);
  const enemy = useSelector(getPlayerCombatEnemy);

  const playerHealthBar = <Progress value={enemy ? ((player.stats.health / player.stats.healthMax) * 100) : 0} />;
  const enemyHealthBar = <Progress value={enemy ? ((enemy?.health / enemy?.maxHealth) * 100) : 0} />;

  return (
    <Box>
      <Box>
        {enemy?.name}
        {enemyHealthBar}
      </Box>

      <Box>
        {player?.name}
        {playerHealthBar}
      </Box>
    </Box>
  );
};
