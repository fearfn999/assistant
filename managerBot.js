const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// List of bad words to filter
const BAD_WORDS = ['stfu', 'nigga', 'dm']; // Replace with your list
const PREFIX = '+'; // Command prefix
let chessGames = new Map(); // To store chess games by user ID

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Message event to filter bad words and manage commands
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    // Check for bad words
    const messageContent = message.content.toLowerCase();
    if (BAD_WORDS.some(badWord => messageContent.includes(badWord))) {
        await message.delete(); // Delete the message
        await message.member.timeout(120000); // Timeout for 2 minutes
        return message.channel.send(`🚫 Please refrain from using bad words, ${message.author.username}! You have been timed out for 2 minutes.`);
    }

    // Command to kick a member
    if (message.content.startsWith(`${PREFIX}kick`)) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply("You don't have permission to use this command.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Please mention a user to kick.");

        try {
            await member.kick();
            message.channel.send(`${member.user.tag} has been kicked.`);
        } catch (error) {
            message.channel.send("I couldn't kick that member. Please check my permissions.");
        }
    }

    // Command to ban a member
    if (message.content.startsWith(`${PREFIX}ban`)) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply("You don't have permission to use this command.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Please mention a user to ban.");

        try {
            await member.ban();
            message.channel.send(`${member.user.tag} has been banned.`);
        } catch (error) {
            message.channel.send("I couldn't ban that member. Please check my permissions.");
        }
    }

    // Command to start a chess game
    if (message.content.startsWith(`${PREFIX}startchess`)) {
        const opponent = message.mentions.members.first();
        if (!opponent) return message.reply("Please mention a user to challenge.");

        if (chessGames.has(message.author.id) || chessGames.has(opponent.id)) {
            return message.reply("One of you is already in a game.");
        }

        // Initialize a new game
        chessGames.set(message.author.id, { opponent: opponent.id, board: initializeChessBoard() });
        message.channel.send(`${message.author} challenged ${opponent} to a game of chess!`);
    }

    // Command to make a move
    if (message.content.startsWith(`${PREFIX}move`)) {
        const args = message.content.split(' ');
        if (args.length < 3) return message.reply("Usage: !move <from> <to>");

        const from = args[1];
        const to = args[2];
        const game = chessGames.get(message.author.id);

        if (!game || game.opponent !== message.mentions.members.first().id) {
            return message.reply("You are not in a game with that user.");
        }

        // Make the move (pseudo-logic, implement chess logic)
        if (makeMove(game.board, from, to)) {
            message.channel.send(`Move made from ${from} to ${to}.`);
        } else {
            message.reply("Invalid move!");
        }
    }

    // Command for help
    if (message.content.startsWith(`${PREFIX}help`)) {
        const helpMessage = `
        **Commands:**
        - \`${PREFIX}kick @user\`: Kick a mentioned user.
        - \`${PREFIX}ban @user\`: Ban a mentioned user.
        - \`${PREFIX}startchess @user\`: Challenge a user to a chess game.
        - \`${PREFIX}move <from> <to>\`: Make a move in the chess game.
        - \`${PREFIX}help\`: Display this help message.
        `;
        message.channel.send(helpMessage);
    }
});

// Placeholder for chess board initialization
function initializeChessBoard() {
    return {}; // Return an empty object for simplicity
}

function makeMove(board, from, to) {
    // Implement chess move logic here
    return true; // Always return true for now
}

// Log in to Discord
client.login('MTI5OTExOTk4NDMyNDM3ODc2NA.GNpF0d.wenWRK8pymJYcw-l5kXoK_zicnA7n5cbOgVf1I');
