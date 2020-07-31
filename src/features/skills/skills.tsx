import React from 'react';
import {
  Box,
  Flex,
  Stack,
} from '@chakra-ui/core';
import { getPlayerSkills } from 'redux/character/character.selectors';
import { useSelector } from 'react-redux';
import { SkillDefs } from 'data/skills.consts';
import {CharacterSkill} from "models/character/skill";
import { EntityIcon } from "features/common/entityIcon/entityIcon";

const renderSkill = (playerSkill: CharacterSkill) => {
  const skill = SkillDefs[playerSkill.skillKey];
  return (
    <Stack spacing={4} direction='row' key={playerSkill.skillKey} align='center'>
      <EntityIcon skill={skill}/>
      <Box flex='1'>{skill.name} (level: {playerSkill.level}, points: {playerSkill.points}/{playerSkill.pointsToLevel})</Box>
    </Stack>
  );
};

export function Skills() {
  const playerSkills = useSelector(getPlayerSkills);

  return (
    <Box p={4}>
      {playerSkills.map(playerSkill => renderSkill(playerSkill))}
    </Box>
  )
}
