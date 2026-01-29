import React from 'react';
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { theme } from '../theme';
import { TypographyVariant } from '../theme/typography';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export function Text({ variant = 'body', style, children, ...rest }: TextProps) {
  const variantStyle = theme.typography[variant] ?? theme.typography.body;
  return (
    <RNText allowFontScaling style={[variantStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}
