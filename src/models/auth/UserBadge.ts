/**
 * Represents a Badge or Achievement earned by a user.
 */
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: string;
}

/**
 * Helper to handle badge data structures from different API versions.
 */
export const mapBadgeFromJSON = (json: any): UserBadge => {
  return {
    id: String(json.id || json.rozet_id || ''),
    name: json.name || json.rozet_ad || json.title || '',
    description: json.description || json.rozet_aciklama || '',
    icon: json.icon || json.rozet_icon || json.image_url || '',
    color: json.color || json.rozet_renk || '#808080',
    earnedAt: json.earnedAt || json.kazanma_tarihi || json.date || ''
  };
};
