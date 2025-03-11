import { Client, Collection, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { subCommandAliases, commandAliases } from "../utils/aliases";

const PREFIX = "myst ";
const commands = new Collection<string, any>();

// Function to resolve aliases
const resolveAlias = (input: string, aliasMap: { [key: string]: string[] }) => {
    for (const [key, aliases] of Object.entries(aliasMap)) {
        if (input === key || aliases.includes(input)) {
            return key;
        }
    }
    return input;
};

// **Modified: Clean version with minimal logs**
export const handleCommands = async (client: Client) => {
    const commandPath = path.join(__dirname, "../commands");

    if (!fs.existsSync(commandPath)) {
        console.error(`❌ Command folder does not exist: ${commandPath}`);
        return;
    }

    const commandFiles = fs.readdirSync(commandPath);
    if (commandFiles.length === 0) {
        console.error(`❌ No commands found in: ${commandPath}`);
        return;
    }

    let loadedCommands: string[] = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            const subCommand = file.toLowerCase();
            const baseSubCommand = resolveAlias(subCommand, subCommandAliases);

            const subCommandFiles = fs.readdirSync(filePath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

            for (const subFile of subCommandFiles) {
                try {
                    const command = (await import(`../commands/${file}/${subFile}`)).default;

                    if (command && command.name) {
                        const baseCommand = resolveAlias(command.name, commandAliases);
                        const commandKey = `${baseSubCommand} ${baseCommand}`;
                        commands.set(commandKey, command);
                        loadedCommands.push(commandKey);
                    }
                } catch (err) {
                    console.error(`❌ Failed to load command: ${subFile}`, err);
                }
            }
        } else if (file.endsWith(".ts") || file.endsWith(".js")) {
            try {
                const command = (await import(`../commands/${file}`)).default;

                if (command && command.name) {
                    const baseCommand = resolveAlias(command.name, commandAliases);
                    commands.set(baseCommand, command);
                    loadedCommands.push(baseCommand);
                }
            } catch (err) {
                console.error(`❌ Failed to load standalone command: ${file}`, err);
            }
        }
    }

    console.log(`🚀 Command Handler Initialized: ${loadedCommands.length} commands loaded.`);

    // Ensure commands are ready before processing messages
    client.on("messageCreate", async (message: Message) => {
        if (!message.content.toLowerCase().startsWith(PREFIX) || message.author.bot) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        if (args.length < 1) return;

        let firstWord: string = (args.shift() ?? "").toLowerCase();
        let secondWord: string = args.length > 0 ? (args.shift() ?? "").toLowerCase() : "";

        const finalArgs = args;

        firstWord = resolveAlias(firstWord, subCommandAliases);
        secondWord = resolveAlias(secondWord, commandAliases);

        let commandKey = firstWord;
        if (secondWord && commands.has(`${firstWord} ${secondWord}`)) {
            commandKey = `${firstWord} ${secondWord}`;
        }

        if (!commands.has(commandKey)) return;

        try {
            await commands.get(commandKey).execute(message, finalArgs);
        } catch (error) {
            console.error(`❌ Error executing command: ${commandKey}`, error);
            message.reply("⚠️ An error occurred while executing that command.");
        }
    });
};
