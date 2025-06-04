
import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  id?: string;
  user_id: string;
  company_name?: string;
  company_address?: string;
  company_city?: string;
  company_state?: string;
  company_zip?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  company_tax_id?: string;
  default_currency_code?: string;
  default_tax_rate?: number;
  default_due_days?: number;
  invoice_prefix?: string;
  payment_terms?: string;
  footer_text?: string;
  email_reminders?: boolean;
  overdue_alerts?: boolean;
  payment_received?: boolean;
  new_invoice?: boolean;
  theme?: string;
  primary_color?: string;
  invoice_template?: string;
  created_at?: string;
  updated_at?: string;
}

class UserSettingsService {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    console.log('Fetching user settings for user:', userId);
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
    
    console.log('User settings fetched:', data);
    return data;
  }

  async createUserSettings(settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>): Promise<UserSettings> {
    console.log('Creating user settings:', settings);
    const { data, error } = await supabase
      .from('user_settings')
      .insert([{ 
        ...settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user settings:', error);
      throw error;
    }
    
    console.log('User settings created:', data);
    return data;
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
    console.log('Updating user settings for user:', userId, settings);
    const updateData = { 
      ...settings, 
      updated_at: new Date().toISOString() 
    };
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;
    
    const { data, error } = await supabase
      .from('user_settings')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
    
    console.log('User settings updated:', data);
    return data;
  }

  async upsertUserSettings(settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>): Promise<UserSettings> {
    console.log('Upserting user settings:', settings);
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        { 
          ...settings,
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting user settings:', error);
      throw error;
    }
    
    console.log('User settings upserted:', data);
    return data;
  }
}

export const userSettingsService = new UserSettingsService();
