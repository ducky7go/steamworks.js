const { platform, arch } = process

/** @typedef {typeof import('./client.d')} Client */
/** @type {Client} */
let nativeBinding = undefined

if (platform === 'win32' && arch === 'x64') {
    nativeBinding = require('./dist/win64/steamworksjs.win32-x64-msvc.node')
} else if (platform === 'linux' && arch === 'x64') {
    nativeBinding = require('./dist/linux64/steamworksjs.linux-x64-gnu.node')
} else if (platform === 'darwin') {
    if (arch === 'x64') {
        nativeBinding = require('./dist/osx/steamworksjs.darwin-x64.node')
    } else if (arch === 'arm64') {
        nativeBinding = require('./dist/osx/steamworksjs.darwin-arm64.node')
    }
} else {
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

let runCallbacksInterval = undefined

/**
 * Initialize the steam client or throw an error if it fails
 * @param {number} [appId] - App ID of the game to load, if undefined, will search for a steam_appid.txt file
 * @returns {Omit<Client, 'init' | 'runCallbacks' | 'shutdown'>}
*/
module.exports.init = (appId) => {
    const { init: internalInit, runCallbacks, restartAppIfNecessary, shutdown, ...api } = nativeBinding

    internalInit(appId)

    clearInterval(runCallbacksInterval)
    runCallbacksInterval = setInterval(runCallbacks, 1000 / 30)

    return api
}

/**
 * Shuts down the Steam client connection and releases resources.
 * This should be called when you want to disconnect from Steam.
 * After calling shutdown(), you can call init() again to re-establish the connection.
 */
module.exports.shutdown = () => {
    clearInterval(runCallbacksInterval)
    runCallbacksInterval = undefined
    nativeBinding.shutdown()
}

/**
 * @param {number} appId - App ID of the game to load
 * {@link https://partner.steamgames.com/doc/api/steam_api#SteamAPI_RestartAppIfNecessary}
 * @returns {boolean}
 */
module.exports.restartAppIfNecessary = (appId) => nativeBinding.restartAppIfNecessary(appId);

/**
 * Check if the Steam client is currently connected and initialized.
 * @returns {boolean} true if Steam client is connected, false otherwise
 */
module.exports.isConnected = () => nativeBinding.isConnected();

/**
 * Enable the steam overlay on electron
 * @param {boolean} [disableEachFrameInvalidation] - Should attach a single pixel to be rendered each frame
*/
module.exports.electronEnableSteamOverlay = (disableEachFrameInvalidation) => {
    const electron = require('electron')
    if (!electron) {
        throw new Error('Electron module not found')
    }

    electron.app.commandLine.appendSwitch('in-process-gpu')
    electron.app.commandLine.appendSwitch('disable-direct-composition')

    if (!disableEachFrameInvalidation) {
        /** @param {electron.BrowserWindow} browserWindow */
        const attachFrameInvalidator = (browserWindow) => {
            browserWindow.steamworksRepaintInterval = setInterval(() => {
                if (browserWindow.isDestroyed()) {
                    clearInterval(browserWindow.steamworksRepaintInterval)
                } else if (!browserWindow.webContents.isPainting()) {
                    browserWindow.webContents.invalidate()
                }
            }, 1000 / 60)
        }

        electron.BrowserWindow.getAllWindows().forEach(attachFrameInvalidator)
        electron.app.on('browser-window-created', (_, bw) => attachFrameInvalidator(bw))
    }
}

const SteamCallback = nativeBinding.callback.SteamCallback
module.exports.SteamCallback = SteamCallback