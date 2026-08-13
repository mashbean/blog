export type HomeFeedKind = "article" | "deck" | "work" | "pro";

export interface HomeFeedItem {
  id: string;
  kind: HomeFeedKind;
  label: string;
  title: string;
  summary: string;
  date: Date;
  url: string;
  detail?: string;
  image?: string;
  imageAlt?: string;
  external?: boolean;
}
