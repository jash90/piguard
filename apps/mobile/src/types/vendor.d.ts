// Type stubs for packages available at runtime via Expo's bundler
// but not installed as direct dependencies in package.json.

declare module '@expo/vector-icons' {
  import { ComponentType } from 'react'
  import { TextProps } from 'react-native'

  interface IconProps extends TextProps {
    name: string
    size?: number
    color?: string
  }

  export const Ionicons: ComponentType<IconProps>
  export const MaterialIcons: ComponentType<IconProps>
  export const FontAwesome: ComponentType<IconProps>
  export const FontAwesome5: ComponentType<IconProps>
  export const Feather: ComponentType<IconProps>
  export const AntDesign: ComponentType<IconProps>
  export const Entypo: ComponentType<IconProps>
  export const EvilIcons: ComponentType<IconProps>
  export const Foundation: ComponentType<IconProps>
  export const MaterialCommunityIcons: ComponentType<IconProps>
  export const Octicons: ComponentType<IconProps>
  export const SimpleLineIcons: ComponentType<IconProps>
  export const Zocial: ComponentType<IconProps>
}

// Expo environment variable shim for tsc
declare const process: {
  env: {
    EXPO_PUBLIC_CONVEX_URL?: string
    NODE_ENV?: string
    [key: string]: string | undefined
  }
}
