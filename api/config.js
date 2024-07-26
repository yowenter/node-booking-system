const env = process.env

const nodeEnv = env.NODE.ENV || 'development'

const serverURL = {
  port: env.PORT || 9091,
  host: env.HOST || '10.50.26.186',
  get serverUrl() {
    return `http://${this.host}:${this.port}`
  }
}

module.exports = serverURL
