export type Media = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

export type Project = {
  id: number;
  slug: string;
  name: string;
  year?: number;
  summary?: string;
  heroMedia?: Media;
  hoverMedia?: Media;
  gallery: Media[];

  departmentId?: number;
  scopeIds: number[];
  typeId?: number;

  teamIds: number[];

  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};
