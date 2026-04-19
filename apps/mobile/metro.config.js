const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Force a single React / React-DOM / React-Native instance across
// symlinked pnpm packages. Without this, react-i18next resolves its
// own React copy and "Invalid hook call" is thrown at runtime.
const FORCED = ['react', 'react-dom', 'react-native']
const forcedMap = Object.fromEntries(
  FORCED.map((mod) => [mod, path.resolve(__dirname, 'node_modules', mod)]),
)
config.resolver = config.resolver ?? {}
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  ...forcedMap,
}

const prevResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const base of FORCED) {
    if (moduleName === base || moduleName.startsWith(base + '/')) {
      const sub = moduleName.slice(base.length)
      const target = path.resolve(__dirname, 'node_modules', base) + sub
      return context.resolveRequest(
        { ...context, originModulePath: path.resolve(__dirname, 'index.js') },
        target,
        platform,
      )
    }
  }
  return prevResolveRequest
    ? prevResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform)
}

module.exports = withNativeWind(config, { input: './src/global.css' })
