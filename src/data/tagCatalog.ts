export interface TagCatalogItem {
  key: string;
  title: string;
  titleEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
}

export const tagCatalog: TagCatalogItem[] = [
  {
    key: "web3",
    title: "web3",
    titleEn: "web3",
    icon: "⛓",
    description: "鏈上資產、收藏、鑄造、交易與錢包生態。",
    descriptionEn: "On-chain assets, collecting, minting, trading, and the wallet ecosystem."
  },
  {
    key: "數位藝術",
    title: "數位藝術",
    titleEn: "Digital art",
    icon: "🎨",
    description: "生成藝術、展覽策展、藝術評論與收藏脈絡。",
    descriptionEn: "Generative art, exhibition curation, art criticism, and collecting contexts."
  },
  {
    key: "治理與民主",
    title: "治理與民主",
    titleEn: "Governance & democracy",
    icon: "🗳",
    description: "DAO、審議工具、社群決策、制度設計與公共治理。",
    descriptionEn: "DAOs, deliberation tools, community decision-making, institutional design, and public governance."
  },
  {
    key: "公共網路",
    title: "公共網路",
    titleEn: "Public internet",
    icon: "🌐",
    description: "公共議題、公民網路、政策脈絡、社群實作與基礎設施。",
    descriptionEn: "Public affairs, civic networks, policy context, community practice, and infrastructure."
  },
  {
    key: "AI與科技",
    title: "AI與科技",
    titleEn: "AI & technology",
    icon: "🤖",
    description: "AI、數位身分、工具演進與科技社會影響。",
    descriptionEn: "AI, digital identity, the evolution of tools, and technology's social impact."
  },
  {
    key: "薄荷薄荷專欄",
    title: "薄荷薄荷專欄",
    titleEn: "Mint-Mint Column",
    icon: "🌿",
    description: "ARTouch 薄荷薄荷專欄與延伸評論，聚焦文化科技與網路社會。",
    descriptionEn: "The ARTouch “Mint-Mint” column and related criticism, focused on cultural technology and networked society."
  }
];
