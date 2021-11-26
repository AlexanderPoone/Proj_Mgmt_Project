## Node installation

Click [here](https://nodejs.org/en/) to download the node.

## Checking your version of npm and Node.js

```
node -v
npm -v
```

## Packets Installation
Run `npm install` to install all requir packets

## Start the server
```
npm start
```
Please use http://127.0.0.1:3000 to be the host.

## Github Oath2.0
In /src/config.json, add your `CLIENT_ID`
```
{
    "GITHUB_COOOKIE_NAME":"access_token",
    "GITHUB_CLIENT_ID":"CLIENT_ID",
    "REDIRECT_URI":"https://127.0.0.1:5000/login",
    "GITHUB_API_ENDPOINT":"https://api.github.com",
    "API_ENDPOINT": "https://127.0.0.1:5000"

}
```