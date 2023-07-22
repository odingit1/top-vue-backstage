import Rollbar from 'rollbar'

const rollbar = new Rollbar({
  accessToken: 'f438df6bdf5244079ba69466e67a2b37',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: ['staging', 'production'].includes(process.env.NODE_ENV),
  payload: {
    environment: process.env.NODE_ENV,
  },
})

export default rollbar
