import React from 'react';
import {
  Box,
  Flex,
} from '@chakra-ui/core';
import { getPlayerSkills } from 'redux/character/character.selectors';
import { useSelector } from 'react-redux';
import { CharacterSkill } from 'redux/character/character.slice';
import { SkillDefs } from 'data/skills.consts';

const renderSkill = (playerSkill: CharacterSkill) => {
  const skill = SkillDefs[playerSkill.skillKey];
  return (
    <Flex id={playerSkill.skillKey}>
      <Box color='white'>{skill.name} ({playerSkill.level})</Box>
    </Flex>
  );
};

export function Skills() {
  const playerSkills = useSelector(getPlayerSkills);

  return (
    <Box p={4} bg="panelBackground" borderWidth="1px" borderTop="none">
      {playerSkills.map(playerSkill => renderSkill(playerSkill))}
    </Box>
  )
}
