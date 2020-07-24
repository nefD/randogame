import theme from "@chakra-ui/theme";
import { mode } from '@chakra-ui/theme-tools';
import { Button, Tab, Progress } from '@chakra-ui/core';

const MyTheme = { ...theme };

MyTheme.styles.global = (props) => ({
  fontFamily: "body",
  color: mode("gray.800", "whiteAlpha.900")(props),
  bg: mode("gray.100", "gray.800")(props),
  // bg: mode("gray.700", "gray.900")(props),
  lineHeight: "base",
  "*::placeholder": {
    color: mode("gray.400", "whiteAlpha.400")(props),
  },
  "*, *::before, &::after": {
    borderColor: mode("gray.200", "whiteAlpha.300")(props),
    wordWrap: "break-word",
  },
  fontFeatureSettings: `"pnum"`,
  fontVariantNumeric: "proportional-nums",
});

// MyTheme.components.Button.baseStyle.container = {
//   ...MyTheme.components.Button.baseStyle.container,
//   textTransform: "uppercase",
// };

Button.defaultProps = {
  size: "sm",
  variant: "solid",
  _focus: {
    boxShadow: "none",
  },
}

Tab.defaultProps = {
  _focus: {
    boxShadow: "none",
  },
};

export default MyTheme;
