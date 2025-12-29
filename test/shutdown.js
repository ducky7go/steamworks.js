const { init, shutdown, isConnected } = require('../index.js')

console.log('=== Testing shutdown functionality ===')

// Test 0: Verify Steam is not connected before initialization
console.log('Step 0: Checking initial connection state...')
const connectedBeforeInit = isConnected()
console.log(`Connected before init: ${connectedBeforeInit}`)
if (connectedBeforeInit) {
  console.log('WARNING: Steam should not be connected before init')
}
console.log('---')

// Test 1: Initialize Steam client
console.log('Step 1: Initializing Steam client...')
const app_id = 3167020 // Spacewar test app
const client = init(app_id)
console.log(`Steam client initialized with app ID: ${app_id}`)

// Test 1.5: Verify connection after init
console.log('Step 1.5: Verifying connection after init...')
const connectedAfterInit = isConnected()
console.log(`Connected after init: ${connectedAfterInit}`)
if (!connectedAfterInit) {
  console.log('ERROR: Should be connected after init')
  process.exit(1)
}

// Test that we can access Steam functionality after init
console.log('Step 2: Verifying Steam connection is active...')
try {
  const playerName = client.localplayer.getName()
  console.log(`Connected! Player name: ${playerName}`)
} catch (e) {
  console.log('Error accessing Steam API:', e.message)
}

// Test 2: Shutdown Steam client
console.log('Step 3: Shutting down Steam client...')
shutdown()
console.log('Steam client has been shut down')

// Test 2.5: Verify Steam API is unavailable after shutdown
console.log('Step 3.5: Verifying Steam connection is closed...')
const connectedAfterShutdown = isConnected()
console.log(`Connected after shutdown: ${connectedAfterShutdown}`)
if (connectedAfterShutdown) {
  console.log('ERROR: Should not be connected after shutdown')
  process.exit(1)
}
console.log('Verified: Steam is disconnected after shutdown')

// Test 3: Re-initialize Steam client to verify we can reconnect
console.log('Step 4: Re-initializing Steam client...')
const client2 = init(app_id)
console.log('Steam client re-initialized successfully')

// Test 3.5: Verify connection after re-init
console.log('Step 4.5: Verifying connection after re-init...')
const connectedAfterReInit = isConnected()
console.log(`Connected after re-init: ${connectedAfterReInit}`)
if (!connectedAfterReInit) {
  console.log('ERROR: Should be connected after re-init')
  process.exit(1)
}

// Test 4: Verify we can access Steam functionality again
console.log('Step 5: Verifying Steam connection is active again...')
try {
  const playerName = client2.localplayer.getName()
  console.log(`Reconnected! Player name: ${playerName}`)
} catch (e) {
  console.log('Error accessing Steam API after re-initialization:', e.message)
}

// Test 5: Shutdown at the end
console.log('Step 6: Final shutdown...')
shutdown()
console.log('Steam client shut down successfully')

// Test 5.5: Verify Steam API is unavailable after final shutdown
console.log('Step 6.5: Verifying Steam connection is closed after final shutdown...')
const connectedAfterFinalShutdown = isConnected()
console.log(`Connected after final shutdown: ${connectedAfterFinalShutdown}`)
if (connectedAfterFinalShutdown) {
  console.log('ERROR: Should not be connected after final shutdown')
  process.exit(1)
}
console.log('Verified: Steam is disconnected after final shutdown')

console.log('=== All tests completed ===')

