import { supabase } from '../lib/supabase';

/**
 * Service for handling feedback operations with Supabase
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const STORAGE_BUCKET = 'feedback-attachments';

export const feedbackService = {
  /**
   * Upload image to Supabase Storage
   * @param {File} file - Image file to upload
   * @param {string} feedbackId - Feedback ID for file naming
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  async uploadImage(file, feedbackId) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file selected');
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 5MB');
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${feedbackId}-${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(`feedback/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase storage error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`feedback/${fileName}`);

      return {
        success: true,
        url: publicUrl,
        fileName: fileName
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  },

  /**
   * Submit feedback to Supabase
   * @param {Object} feedbackData - Feedback form data
   * @param {string} feedbackData.name - User's name
   * @param {string} feedbackData.email - User's email
   * @param {string} feedbackData.category - Feedback category
   * @param {number} feedbackData.rating - Rating (1-5)
   * @param {string} feedbackData.message - Feedback message
   * @param {string} [feedbackData.attachmentUrl] - Optional attachment URL
   * @param {string} [userId] - Optional authenticated user ID
   * @returns {Promise<{success: boolean, error?: any}>}
   */
  async submitFeedback(feedbackData, userId = null) {
    try {
      const { name, email, category, rating, message, attachmentUrl } = feedbackData;

      // Validate required fields
      if (!name || !email || !category || !rating || !message) {
        throw new Error('All fields are required');
      }

      if (message.length < 10) {
        throw new Error('Message must be at least 10 characters');
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Insert feedback into Supabase
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          {
            name,
            email,
            category,
            rating,
            message,
            attachment_url: attachmentUrl || null,
            user_id: userId,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      return {
        success: true,
        data: data[0]
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit feedback'
      };
    }
  },

  /**
   * Get all feedback (admin only)
   * @returns {Promise<{data: Array, error?: any}>}
   */
  async getAllFeedback() {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return { data: null, error };
    }
  },

  /**
   * Get feedback by category
   * @param {string} category - Feedback category
   * @returns {Promise<{data: Array, error?: any}>}
   */
  async getFeedbackByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching feedback by category:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete feedback (admin only)
   * @param {string} feedbackId - Feedback ID to delete
   * @returns {Promise<{success: boolean, error?: any}>}
   */
  async deleteFeedback(feedbackId) {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting feedback:', error);
      return { success: false, error };
    }
  }
};
