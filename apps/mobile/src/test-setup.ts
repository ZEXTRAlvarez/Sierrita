import 'react-native-gesture-handler/jestSetup';

// Standard RN testing mock: Animated.spring/timing with useNativeDriver:true
// needs the native animated module, which @react-native/jest-preset doesn't
// stub on its own (unlike jest-expo).
jest.mock('react-native/src/private/animated/NativeAnimatedHelper');

// Switch.js imports its Android/iOS native codegen specs unconditionally, and
// the currently installed @react-native/babel-plugin-codegen (pulled in by
// babel-preset-expo, pinned to an older RN) can't parse the specs shipped by
// this RN version. Swap in a plain host element with the same a11y contract
// so getByRole('switch') / fireEvent(..., 'valueChange', ...) keep working.
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: function Switch({
      value,
      onValueChange,
      disabled,
      ...rest
    }: {
      value?: boolean;
      onValueChange?: (value: boolean) => void;
      disabled?: boolean;
      [key: string]: unknown;
    }) {
      return React.createElement(View, {
        ...rest,
        accessible: true,
        accessibilityRole: 'switch',
        accessibilityState: { checked: !!value, disabled: !!disabled },
        onValueChange,
      });
    },
  };
});

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (object) => JSON.parse(JSON.stringify(object));
}
