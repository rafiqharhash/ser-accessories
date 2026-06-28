import { Settings } from "@/models/settings.model";
import { ISettings } from "@/types/models/settings.types";

export class SettingsRepository {
  static async getSettings(): Promise<ISettings | null> {
    return Settings.findOne().lean();
  }

  static async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    const settings = await Settings.findOne();
    if (settings) {
      return Settings.findByIdAndUpdate(settings._id, data, { new: true }).lean() as unknown as ISettings;
    }
    const newSettings = new Settings(data);
    return newSettings.save();
  }
}
