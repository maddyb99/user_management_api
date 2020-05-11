# Setup
Run:
```shell
npm install -g firebase-tools
firebase login
cd functions/
npm install
```

# Making changes
Code is in functions/src

After making changes, just run:
```shell
firebase deploy --only functions
```

# Setting up Authorization
It is recommended to setup an API key.
To do this, run:
```shell
firebase functions:config:set tab_api.client_key='YOUR_CURRENT_API_KEY'
```

To generate a new API key, run:
```shell
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"
```
