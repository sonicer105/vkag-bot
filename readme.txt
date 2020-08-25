Bot I made for the Vancouver Kinky and Geeky Discord server. It assigns roles based on the first letter of your username
or nickname on the guild when you join it or update your username/nick on the server.

REQUIREMENTS

- NodeJS 12.x or greater (tested with 12.18.3)

HOW TO USE

1) Clone the repo `git clone (url)`
2) Downloaded the dependencies `npm install`
3) copy config_example.json to config.json and replace "Your Token Here" with your bot's token
4) Modify the rolesToAssign variable near the top of index.js to meet your requirements
5) run the bot `node index.js`