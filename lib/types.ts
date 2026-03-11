export interface ItemVariant {
  id: string;
  label: string;
  color: string;
  emoji: string;
}

export interface SofrehItem {
  id: string;
  englishName: string;
  phoneticName: string;
  farsiName: string;
  symbolism: string;
  isCore: boolean;
  variants: ItemVariant[];
}

export interface UserSelection {
  itemId: string;
  variantId: string;
}
