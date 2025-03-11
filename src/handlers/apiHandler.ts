import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Change this to your actual Fastify API URL

export const apiHandler = {
    // Helper function to extract error message safely
    handleError(error: unknown, context: string) {
        let errorMessage = "An unknown error occurred.";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error(`❌ [API ERROR] ${context}: ${errorMessage}`);
        return null;
    },

    // ✅ Get userId from username
    async getTTLog(username: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/ttLog/${username}`);
            return response.data;
        } catch (error: unknown) {
            console.error(`❌ Error fetching ttLog for ${username}:`, error);
            return null; // Return null if not found or error occurs
        }
    },

    // ✅ Set ttLog Entry (username -> userId)
    async setTTLog(username: string, userId: string) {
        try {
            const response = await axios.post(`${API_BASE_URL}/ttLog`, { username, userId });
            return response.data;
        } catch (error: unknown) {
            console.error(`❌ Error setting ttLog for ${username}:`, error);
            return null;
        }
    },

    // ✅ Delete ttLog Entry
    async deleteTTLog(username: string) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/ttLog/${username}`);
            return response.data;
        } catch (error: unknown) {
            console.error(`❌ Error deleting ttLog for ${username}:`, error);
            return null;
        }
    },

    // ✅ Get all active giveaways
    async getGiveaways() {
        try {
            const response = await axios.get(`${API_BASE_URL}/giveaways`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, "Failed to fetch active giveaways");
        }
    },

    // ✅ Get a specific giveaway by ID
    async getGiveaway(giveawayId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/giveaway/${giveawayId}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to fetch giveaway ${giveawayId}`);
        }
    },

    // ✅ Host a new giveaway
    async createGiveaway(
        hostId: string,
        guildId: string,
        prize: string,
        requirements: string,
        allowedRoles: string[],
        endDate: string // Ensure date is formatted correctly
    ) {
        try {
            const response = await axios.post(`${API_BASE_URL}/giveaway`, {
                hostId,
                guildId,
                prize,
                requirements,
                allowedRoles,
                endDate,
            });
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, "Failed to create giveaway");
        }
    },

    // ✅ Join a giveaway
    async joinGiveaway(giveawayId: string, userId: string) {
        try {
            const response = await axios.post(`${API_BASE_URL}/giveaway/${giveawayId}/join`, { userId });
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to join giveaway ${giveawayId}`);
        }
    },

    // ✅ Leave a giveaway
    async leaveGiveaway(giveawayId: string, userId: string) {
        try {
            const response = await axios.post(`${API_BASE_URL}/giveaway/${giveawayId}/leave`, { userId });
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to leave giveaway ${giveawayId}`);
        }
    },

    // ✅ End a giveaway manually
    async endGiveaway(giveawayId: string) {
        try {
            const response = await axios.post(`${API_BASE_URL}/giveaway/${giveawayId}/end`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to end giveaway ${giveawayId}`);
        }
    },

    // ✅ Reroll a giveaway winner
    async rerollGiveaway(giveawayId: string) {
        try {
            const response = await axios.post(`${API_BASE_URL}/giveaway/${giveawayId}/reroll`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to reroll giveaway ${giveawayId}`);
        }
    },

    // ✅ Check cooldowns for a channel
    async getCooldown(channelId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/cooldown/${channelId}`);
            return response.data;
        } catch (error: unknown) {
            console.error(`❌ Error fetching cooldown for channel ${channelId}:`, error);
            return { emojiActive: false, nameActive: false };
        }
    },

    // ✅ Set cooldown (either emoji or name) for a channel
    async setCooldown(channelId: string, type: "emoji" | "name") {
        try {
            const response = await axios.post(`${API_BASE_URL}/cooldown/${channelId}`, { type });
            return response.data;
        } catch (error: unknown) {
            console.error(`❌ Error setting ${type} cooldown for channel ${channelId}:`, error);
            return null;
        }
    },

    // ✅ Remove cooldown (either emoji or name) for a channel
    async removeCooldown(channelId: string, type: "emoji" | "name") {
        try {
            const response = await axios.delete(`${API_BASE_URL}/cooldown/${channelId}`, { data: { type } });
            return response.data;
        } catch (error: unknown) {
            console.error(`❌ Error removing ${type} cooldown for channel ${channelId}:`, error);
            return null;
        }
    },

    // ✅ Fetch Channel by userId or channelId
    async getChannel(userId?: string, channelId?: string) {
        if (!userId && !channelId) {
            console.error("❌ [API ERROR] getChannel: Provide either userId or channelId.");
            return null;
        }

        try {
            const query = userId ? `userId=${userId}` : `channelId=${channelId}`;
            const response = await axios.get(`${API_BASE_URL}/channel?${query}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to fetch channel for userId: ${userId}, channelId: ${channelId}`);
        }
    },

    // ✅ Set (Create/Update) Channel
    async setChannel(userId: string, channelId: string) {
        if (!userId || !channelId) {
            console.error("❌ [API ERROR] setChannel: Both userId and channelId are required.");
            return null;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/channel`, { userId, channelId });
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to set channel for userId: ${userId}, channelId: ${channelId}`);
        }
    },

    // ✅ Delete Channel by userId or channelId
    async deleteChannel(userId?: string, channelId?: string) {
        if (!userId && !channelId) {
            console.error("❌ [API ERROR] deleteChannel: Provide either userId or channelId.");
            return null;
        }

        try {
            const query = userId ? `userId=${userId}` : `channelId=${channelId}`;
            const response = await axios.delete(`${API_BASE_URL}/channel?${query}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to delete channel for userId: ${userId}, channelId: ${channelId}`);
        }
    },

    // ✅ Fetch MTUser Data
    async getMTUser(userId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/mtuser/${userId}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to fetch MTUser ${userId}`);
        }
    },

    // ✅ Fetch RXUser Data
    async getRXUser(userId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/rxuser/${userId}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to fetch RXUser ${userId}`);
        }
    },

    // ✅ Fetch Sticky Message
    async getStickyMessage(channelId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/sticky/${channelId}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to fetch sticky message for channel ${channelId}`);
        }
    },

    // ✅ Set Sticky Message
    async setStickyMessage(channelId: string, messageId: string) {
        try {
            const response = await axios.post(`${API_BASE_URL}/sticky/${channelId}`, { messageId });
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to set sticky message for channel ${channelId}`);
        }
    },

    // ✅ Fetch Boosted Arena List
    async getBoostedArena(guildId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/boosted-arena/${guildId}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to fetch boosted arena list for guild ${guildId}`);
        }
    },

    // ✅ Set Boosted Arena List
    async setBoostedArena(guildId: string, messageId: string, members: string[]) {
        try {
            const response = await axios.post(`${API_BASE_URL}/boosted-arena/${guildId}`, { messageId, members });
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to set boosted arena list for guild ${guildId}`);
        }
    },

    // ✅ Update MTUser Data
    async updateMTUser(userId: string, data: Record<string, any>) {
        try {
            const response = await axios.post(`${API_BASE_URL}/mtuser/${userId}`, data);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to update MTUser ${userId}`);
        }
    },

    // ✅ Update RXUser Data
    async updateRXUser(userId: string, data: Record<string, any>) {
        try {
            const response = await axios.post(`${API_BASE_URL}/rxuser/${userId}`, data);
            return response.data;
        } catch (error: unknown) {
            return this.handleError(error, `Failed to update RXUser ${userId}`);
        }
    }
};
