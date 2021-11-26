# Prototpye

## Basic Set up

Please following the [guideline](https://github.com/SoftFeta/CS5351_Project/blob/main/README.md) to set up.

## Flask installation

Please refer [here](https://github.com/SoftFeta/CS5351_Project/blob/alpha/flask/README.md).

## Web installation

Please refer [here](https://github.com/SoftFeta/CS5351_Project/blob/alpha/prototype/web/README.md).

## Start the flask

```
cd /flask
python main.py
```

## Start the web
```
cd /web
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