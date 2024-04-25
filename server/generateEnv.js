// generateEnv.js

const fs = require('fs');

const envVariables = {
  REACT_APP_SERVER_URL: process.env.SERVER_URL || 'http://localhost:3001',
  
};

const envScript = Object.entries(envVariables)
  .map(([key, value]) => `window.${key} = '${value}';`)
  .join('\n');

fs.writeFileSync('./client/src/env.js', envScript);