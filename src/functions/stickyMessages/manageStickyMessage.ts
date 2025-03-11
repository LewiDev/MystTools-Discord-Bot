import { Client } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

const { EmbedBuilder } = require('discord.js');

export default async (client: Client, channelId: string) => {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel?.isTextBased()) return null;
      
      // Create embed for sticky message
      const embed = new EmbedBuilder()
        .setTitle("🌀 TT Verification")
        .setDescription("To verify your time travel you must type `rpg p` below this message!");
      
      // Find existing sticky message in database
      const existingSticky = await apiHandler.getStickyMessage(channel.id);
      
      // Try to delete old message if it exists
      if (existingSticky) {
        try {
          const oldMessage = await channel.messages.fetch(existingSticky.messageId);
          await oldMessage.delete();
        } catch (err) {
          console.log('Old sticky message not found, creating new one');
        }
      }
      let newMessage;

      
      // Send new sticky message
      if (channel.isTextBased() && 'send' in channel) {
        newMessage = await channel.send({ embeds: [embed] });
        // Update or create entry in database
      }

      if(!newMessage) return;

      // Update or create entry in database
      await apiHandler.setStickyMessage(channel.id, newMessage.id);
      
      return newMessage;
    } catch (error) {
      console.error('Error managing sticky message:', error);
      return null;
    }
};

