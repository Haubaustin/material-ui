'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_capitalize as capitalize } from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import { OverridableComponent } from '@mui/types';
import useTabPanel from '@mui/base/useTabPanel';
import { useTabsContext } from '@mui/base/Tabs';
import { styled, useThemeProps } from '../styles';
import { useColorInversion } from '../styles/ColorInversion';
import SizeTabsContext from '../Tabs/SizeTabsContext';
import { getTabPanelUtilityClass } from './tabPanelClasses';
import { TabPanelOwnerState, TabPanelTypeMap } from './TabPanelProps';
import useSlot from '../utils/useSlot';

const useUtilityClasses = (ownerState: TabPanelOwnerState) => {
  const { hidden, size, variant, color, orientation } = ownerState;

  const slots = {
    root: [
      'root',
      hidden && 'hidden',
      size && `size${capitalize(size)}`,
      orientation,
      variant && `variant${capitalize(variant)}`,
      color && `color${capitalize(color)}`,
      size && `size${capitalize(size)}`,
    ],
  };

  return composeClasses(slots, getTabPanelUtilityClass, {});
};

const TabPanelRoot = styled('div', {
  name: 'JoyTabPanel',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TabPanelOwnerState }>(({ theme, ownerState }) => ({
  display: ownerState.hidden ? 'none' : 'block',
  padding: 'var(--Tabs-spacing)',
  flexGrow: 1,
  fontFamily: theme.vars.fontFamily.body,
  ...theme.typography[`body-${ownerState.size!}`],
  ...theme.variants[ownerState.variant!]?.[ownerState.color!],
}));
/**
 *
 * Demos:
 *
 * - [Tabs](https://mui.com/joy-ui/react-tabs/)
 *
 * API:
 *
 * - [TabPanel API](https://mui.com/joy-ui/api/tab-panel/)
 */
const TabPanel = React.forwardRef(function TabPanel(inProps, ref) {
  const props = useThemeProps<typeof inProps & { component?: React.ElementType }>({
    props: inProps,
    name: 'JoyTabPanel',
  });

  const { orientation } = useTabsContext() || { orientation: 'horizontal' };
  const tabsSize = React.useContext(SizeTabsContext);

  const {
    children,
    value = 0,
    component,
    color: colorProp = 'neutral',
    variant = 'plain',
    size: sizeProp,
    slots = {},
    slotProps = {},
    ...other
  } = props;

  const { hidden, getRootProps } = useTabPanel({ ...props, value });

  const size = sizeProp ?? tabsSize;
  const { getColor } = useColorInversion(variant);
  const color = getColor(inProps.color, colorProp);

  const ownerState = {
    ...props,
    orientation,
    hidden,
    size,
    color,
    variant,
  };

  const classes = useUtilityClasses(ownerState);
  const externalForwardedProps = { ...other, component, slots, slotProps };

  const [SlotRoot, rootProps] = useSlot('root', {
    ref,
    elementType: TabPanelRoot,
    getSlotProps: getRootProps,
    externalForwardedProps,
    additionalProps: {
      role: 'tabpanel',
      ref,
      as: component,
    },
    ownerState,
    className: classes.root,
  });

  return <SlotRoot {...rootProps}>{!hidden && children}</SlotRoot>;
}) as OverridableComponent<TabPanelTypeMap>;

TabPanel.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'neutral'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['danger', 'neutral', 'primary', 'success', 'warning']),
    PropTypes.string,
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The size of the component.
   */
  size: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['sm', 'md', 'lg']),
    PropTypes.string,
  ]),
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.shape({
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: PropTypes.shape({
    root: PropTypes.elementType,
  }),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The value of the TabPanel. It will be shown when the Tab with the corresponding value is selected.
   * @default 0
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The [global variant](https://mui.com/joy-ui/main-features/global-variants/) to use.
   * @default 'plain'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['outlined', 'plain', 'soft', 'solid']),
    PropTypes.string,
  ]),
} as any;

export default TabPanel;
