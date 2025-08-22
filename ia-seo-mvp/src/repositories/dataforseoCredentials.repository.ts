import { DataForSEOCredentials } from '../models/dataforseoCredentials.model';

export const DataForSEOCredentialsRepository = {
    async getByUserId(userId: number) {
        return DataForSEOCredentials.findOne({ where: { userId } });
    },

    async hasCredentials(userId: number): Promise<boolean> {
        const credentials = await this.getByUserId(userId);
        return !!credentials;
    },

    async upsertByUserId(userId: number, login: string, password: string) {
        const existing = await DataForSEOCredentials.findOne({ where: { userId } });
        if (existing) {
            existing.login = login;
            existing.password = password;
            await existing.save();
            return existing;
        } else {
            return DataForSEOCredentials.create({ userId, login, password });
        }
    },
};
