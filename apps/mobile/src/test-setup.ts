import 'react-native-gesture-handler/jestSetup';

// PalitosTray (CasitaGame) drags sticks with react-native-reanimated; this
// installs its Jest-safe requestAnimationFrame/timing mocks.
require('react-native-reanimated').setUpTests();

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

// @sierrita/audio's speak() wraps expo-speech (another native-only Expo
// module) and is called from nearly every game screen. Mock at the package
// boundary — same reasoning as the expo-image mock below.
jest.mock('@sierrita/audio', () => ({
  speak: jest.fn(async () => undefined),
  stopSpeech: jest.fn(),
  isSpeaking: jest.fn(async () => false),
}));

// expo-image (used by IconAnimation) requires expo-modules-core's native
// EventEmitter binding (globalThis.expo), which only the real native runtime
// installs — @react-native/jest-preset doesn't stub it (jest-expo did). Swap
// in RN's built-in Image; it ignores the expo-only props (contentFit, autoplay).
jest.mock('expo-image', () => {
  const { Image } = require('react-native');
  return { Image };
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
