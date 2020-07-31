import React from 'react';
import {Center, useColorModeValue} from '@chakra-ui/core';
import { IconCube } from "data/icons.consts";

type IconProps = {
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  size?: 'sm' | 'md';
};

export function Icon(props: IconProps) {
  const { size = 'md' } = props;

  // const bg = useColorModeValue("gray.200", "gray.800");
  // const iconFill = useColorModeValue("black", "white");

  const bg = 'gray.200';
  const iconFill = 'white';

  const containerSize = size === 'sm' ? '1.5em' : '2.5rem';
  const iconSize = size === 'sm' ? '1em' : '2rem';

  // const containerSize = '2.5rem';
  // const iconSize = '1.75rem';

  const svgStyles = {
    fill: iconFill,
    width: iconSize,
    height: iconSize,
    maxWidth: iconSize,
    maxHeight: iconSize,
  }

  return (
    <Center bg={bg} borderColor='gray.500' borderWidth='1px' borderRadius='md' boxSize={containerSize}>
      {props.icon
        ? <props.icon style={svgStyles} />
        : <IconCube style={svgStyles} />
      }
    </Center>
  )
}

