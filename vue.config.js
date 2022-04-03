module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://localhost:44396'
        },
        '/save':{
          target: 'https://localhost:44392'
        },
        '/profile':{
          target: 'https://localhost:44394'
        }
      }
    }
  }