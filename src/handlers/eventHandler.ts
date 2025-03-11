import { Client } from "discord.js";
import fs from "fs";
import path from "path";

export const handleEvents = (client: Client) => {
    const eventsPath = path.join(__dirname, "../events");
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
        const folderPath = path.join(eventsPath, folder);
        const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

        for (const file of eventFiles) {
            const event = require(path.join(folderPath, file)).default;

            if (!event || !event.name) {
                console.warn(`⚠️ Skipping invalid event file: ${file}`);
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }

            console.log(`✅ Event Loaded: ${event.name}`);
        }
    }
};
