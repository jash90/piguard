/// <reference types="nativewind/types" />

// Extend React Native component props with className (NativeWind v4)
// react-native-css-interop augments these in the pnpm store;
// we duplicate them here so tsc can resolve without the hoisted package.
import 'react-native'

declare module 'react-native' {
  interface ViewProps {
    className?: string
  }
  interface TextProps {
    className?: string
  }
  interface TextInputProps {
    className?: string
  }
  interface ImageProps {
    className?: string
  }
  interface ScrollViewProps {
    className?: string
  }
  interface TouchableOpacityProps {
    className?: string
  }
  interface TouchableHighlightProps {
    className?: string
  }
  interface TouchableWithoutFeedbackProps {
    className?: string
  }
  interface KeyboardAvoidingViewProps {
    className?: string
  }
  interface SafeAreaViewProps {
    className?: string
  }
  interface ActivityIndicatorProps {
    className?: string
  }
  interface SwitchProps {
    className?: string
  }
  interface FlatListProps<ItemT> {
    className?: string
  }
}
