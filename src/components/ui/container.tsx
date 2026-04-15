import { useAppTheme } from '@/theme/use-app-theme';
import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';

type ContainerLikeProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
};

interface ContainerBaseProps {
  children: React.ReactNode;
  /** Custom wrapper component (e.g. ScrollView). Takes precedence over scrollable. */
  component?: React.ElementType;
  style?: StyleProp<ViewStyle>;
}

interface ScrollableContainerProps extends ContainerBaseProps {
  /** Use ScrollView as wrapper. */
  scrollable: true;
  contentContainerStyle?: StyleProp<ViewStyle>;
  componentProps?: Omit<ScrollViewProps, 'children' | 'style' | 'contentContainerStyle'>;
}

interface StaticContainerProps extends ContainerBaseProps {
  /** Use View as wrapper. Default mode. */
  scrollable?: false;
  contentContainerStyle?: never;
  componentProps?: Omit<ViewProps, 'children' | 'style'>;
}

export type ContainerProps = ScrollableContainerProps | StaticContainerProps;

export function Container({
  children,
  scrollable = false,
  component,
  style,
  contentContainerStyle,
  componentProps,
}: ContainerProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors.background);

  const ResolvedComponent: React.ElementType = component ?? (scrollable ? ScrollView : View);
  const props = (componentProps ?? {}) as ContainerLikeProps;
  const {
    style: componentStyle,
    contentContainerStyle: componentContentStyle,
    showsVerticalScrollIndicator,
    ...restProps
  } = props;

  const isScrollContainer = scrollable || ResolvedComponent === ScrollView;

  if (isScrollContainer) {
    return (
      <ResolvedComponent
        {...restProps}
        style={[
          styles.base,
          componentStyle,
          style,
        ]}
        contentContainerStyle={[componentContentStyle, contentContainerStyle]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? false}
      >
        {children}
      </ResolvedComponent>
    );
  }

  return (
    <ResolvedComponent
      {...restProps}
      style={[
        styles.base,
        componentStyle,
        style,
      ]}
    >
      {children}
    </ResolvedComponent>
  );
}

const createStyles = (backgroundColor: string) => StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor,
  },
});

