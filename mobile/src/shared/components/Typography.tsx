import React from 'react';
import {Text, TextProps, StyleSheet} from 'react-native';
import {useAppTheme} from '../../core/theme/theme';

type TypographyProps = TextProps & {
  variant?: 'body' | 'title';
};

export const Typography: React.FC<TypographyProps> = ({variant = 'body', style, children, ...rest}) => {
  const theme = useAppTheme();
  const variantStyle = variant === 'title' ? styles.title : styles.body;

  return (
    <Text style={[{color: theme.colors.textPrimary}, variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
  },
});
