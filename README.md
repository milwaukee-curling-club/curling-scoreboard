# Curling Scoreboard

Curling scoreboard provides a webview for OBS Studio with a mobile friendly admin interface to update the score in real time.

## Getting Started

### Prerequisites

Install latest [NodeJS](https://nodejs.org/en/download/) and ensure `npm` is also installed. You can verify each is installed with `node --version` and `npm --version`.

### Setup

The first thing you'll need to do is install/compile all of the dependencies in the package.json. You can do this by executing `npm install`.

## Usage

1. `npm start` (or `PORT=3000 npm start` to use a custom port)
1. Go to the server (either localhost or the IP address of the machine running the server)
1. Update the form to match the match details
1. Visit `/scoreboard` to view the scoreboard
