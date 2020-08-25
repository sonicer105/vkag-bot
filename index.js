const Discord = require("discord.js");
const config = require("./config.json");

const prefix = '!';
const presence = 'DnD';

// Here we are using regular expression to match users to a role name
const rolesToAssign = {
    '^[0-9]$': '1-9',
    '^[a-fA-F]$': 'A-F',
    '^[g-mG-M]$': 'G-M',
    '^[n-sN-S]$': 'N-S',
    '^[t-zT-Z]$': 'T-Z'
};

// Get an instance of the client
const client = new Discord.Client();

/**
 * Attempts to login to Discord's API
 */
function tryLogin() {
    console.log(new Date().toUTCString()); // Logging the current time
    client.login(config.BOT_TOKEN).then(function (data) { // Attempt the login with the bot token
        console.log("Logged in as " + client.user.username + "#" + client.user.discriminator + " (" + client.user.id + ")");
        client.user.setPresence({activity: {name: presence}}) // Set the "Now Playing" message.
    }, function (reason) { // If something went wrong
        console.log("Failed to log in!");
        console.error(reason); // Log it
        setTimeout(tryLogin, 1000); // Try Again
    })
}

/**
 * Assigns a member the role based on the definitions in rolesToAssign
 * @param member
 */
function assignRole(member) {
    // Use the nickname if it exists, otherwise, stick with the username
    let name = (member.nickname != null) ? member.nickname : member.user.username;
    name = name.slice(0,1); // We only want the first letter

    let rolesToRemove = [];
    let roleToAdd = '';

    for(let i in rolesToAssign){ // For every
        if (rolesToAssign.hasOwnProperty(i)){
            // This block fetches the ID for the role name we have
            let id = member.guild.roles.cache.filter(function(value, key, collection){
                return value.name.toLowerCase() === rolesToAssign[i].toLowerCase()
            }).entries().next().value[0];

            if (name.match(i)) { // Check the username against the regex
                roleToAdd = id // Set it as the role to add
            } else {
                rolesToRemove.push(id) // Add it to the list of roles to remove
            }

        }
    }
    if(rolesToRemove.length > 0) {
        member.roles.remove(rolesToRemove); // Remove our list of roles
    }
    if(roleToAdd.length > 0) {
        member.roles.add(roleToAdd); // Add our one role
    }
}

/**
 * Allows user to ping the bot to see if it's alive
 */
client.on("message", function(msg) {
    if (msg.author.bot) return; // We only server humans
    if (!msg.content.startsWith(prefix)) return; // Must have our prefix

    const commandBody = msg.content.slice(prefix.length); // Removes the prefix
    const args = commandBody.split(' '); // Breaks up the message using spaces
    const command = args.shift().toLowerCase(); // Removes the command from our array and converts it to lowercase

    if (command === "ping") { // If the command was Ping
        const timeTaken = Date.now() - msg.createdTimestamp; // Compare it the current time to when the message was created to get latency
        msg.reply(`Pong! This message had a latency of ${timeTaken}ms.`); // Respond in the channel the message was sent with the reply containing the latency
    }
});

/**
 * Handles the event whenever a guild member joins
 */
client.on('guildMemberAdd', function (member) {
    assignRole(member); // Call out method assignRole from above
});

/**
 * Handles the event whenever a guild member updates their user information
 */
client.on('guildMemberUpdate', function (oldMember, newMember) {
    // Check to see if the username/nickname was altered. That's all we care about.
    if(oldMember.nickname !== newMember.nickname || oldMember.user.username !== newMember.user.username) {
        assignRole(newMember); // Call out method assignRole from above
    }
});

tryLogin();

