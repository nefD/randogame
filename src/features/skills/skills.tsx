import React from 'react';
import {
  Box,
  Flex,
} from '@chakra-ui/core';
import { getPlayerSkills } from 'redux/character/character.selectors';
import { useSelector } from 'react-redux';
import { SkillDefs } from 'data/skills.consts';
import {CharacterSkill} from "models/character/skill";

const renderSkill = (playerSkill: CharacterSkill) => {
  const skill = SkillDefs[playerSkill.skillKey];
  return (
    <Flex key={playerSkill.skillKey}>
      <Box>{skill.name} (level: {playerSkill.level}, points: {playerSkill.points}/{playerSkill.pointsToLevel})</Box>
    </Flex>
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
