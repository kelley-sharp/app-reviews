# Runway Coding Challenge

This is a ~3-hour coding challenge that fetches the past 48 hours of RSS reviews from an app in the app store.

## How It Works

The backend fetches RSS reviews from the past 48 hours (for the Airbnb app by default) every 5 minutes.
The reviews are stored locally on the file system in the `data/reviews` folder in a JSON file where the name of the file is `${appId}.json`.

The `DEFAULT_APP_ID` can be changed in the `config.js` file to a different app! This will change for the backend.

The frontend is also hard-coded in `src/config.ts`.

Similarly, the `POLLING_INTERVAL_MS` in the same file can be changed to adjust the polling frequency.

### Endpoints

Right now there is a single endpoint for `/reviews/:appId`. I tried to imply RESTful routing. One thing I would do if I had more time is if you pass an `appId` that doesn't match the `DEFAULT_APP_ID`, then query for the last 48 hours on-the-fly and then start polling for that ID as well. A more advanced API might allow you to set and unset polling for different app IDs.

## How to Run the App Locally

### Backend

To run the Node.js backend:

1. `cd backend`
2. `npm install`
3. `npm start`

The backend should be available at `http://localhost:3001` by default, but the `PORT` variable can be changed in `server.js`.

### Frontend

The frontend was bootstrapped with [`create-react-app`](https://create-react-app.dev/docs/adding-typescript/) (TypeScript template).

To run the React frontend:

1. `cd frontend`
2. `npm install`
3. `npm start`

The frontend should be available at `http://localhost:3000` by default.
