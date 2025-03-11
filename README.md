# MystTools Bot

**MystTools** is a Discord bot designed for server management, automation, and enhanced user interaction. It integrates with the **Mysthaven API** to provide optimized data handling for commands such as giveaways, channel permissions, and role-based utilities. In the future, **Rank Examiner** will also use this bot for ranking and XP-related features.

## Features
- **Command Handler with Aliases** - Supports an extensible command system.
- **Integration with Mysthaven API** - Optimized data retrieval and storage.
- **Channel & Role Management** - Automate server tasks like permissions and custom channels.
- **Utility Commands** - Includes `ping`, `help`, `rules`, and more.

## Project Structure
```
MystTools/
├── src/
│   ├── index.ts                 # Main bot entry point
│   ├── commands/
│   │   ├── help.ts              # Help command
│   │   ├── ping.ts              # Ping command
│   │   ├── rules.ts             # Rules command
│   │   ├── channel/
│   │   │   ├── emoji.ts         # Channel-specific emoji handling
│   ├── handlers/
│   │   ├── commandHandler.ts    # Command handling logic
│   │   ├── eventHandler.ts      # Event management
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── apiClient.ts         # API integration for MysthavenAPI
│   ├── ...
```

## Why This Bot Exists
- **MystTools** serves as a foundational Discord bot for automating server tasks and integrating API-based data.
- The bot is designed to **offload complex operations** to the **Mysthaven API**, improving efficiency.
- Eventually, **Rank Examiner** will utilize this same API for XP, ranking, and leaderboard functionality.

## Future Plans
- **Expand API integration with MysthavenAPI**
- **Improve command modularity for scalability**
- **Introduce economy and reward systems**
- **Enhance logging and debugging tools**

## License
This project is archived for portfolio reference only.

