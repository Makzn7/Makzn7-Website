export type SeoFields = {
  meta_title_ar?: string | null;
  meta_title_en?: string | null;
  meta_description_ar?: string | null;
  meta_description_en?: string | null;
  meta_keywords_ar?: string | null;
  meta_keywords_en?: string | null;
  og_title_ar?: string | null;
  og_title_en?: string | null;
  og_description_ar?: string | null;
  og_description_en?: string | null;
  og_image?: string | null;
  twitter_title_ar?: string | null;
  twitter_title_en?: string | null;
  twitter_description_ar?: string | null;
  twitter_description_en?: string | null;
  twitter_image?: string | null;
  canonical_url?: string | null;
  robots_index?: boolean | null;
  robots_follow?: boolean | null;
};

export type Settings = {
  phone?: string;
  email?: string;
  address_ar?: string;
  address_en?: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    vimeo?: string;
  };
  cr_number?: string;
  vat_number?: string;
  seo?: SeoFields | null;
};
