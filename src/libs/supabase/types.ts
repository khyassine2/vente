/** Row shapes mirroring `supabase/schema.sql`, hand-written for both clients. */

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  fabric: string;
  price: number;
  compare_at_price: number | null;
  is_new: boolean;
  categories: string[];
  created_at: string;
  updated_at: string;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  size: string;
  color_name: string;
  color_hex: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & Pick<ProductRow, 'slug' | 'name' | 'price'>;
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      product_variants: {
        Row: ProductVariantRow;
        Insert: Partial<ProductVariantRow> & Pick<ProductVariantRow, 'product_id' | 'size' | 'color_name' | 'color_hex'>;
        Update: Partial<ProductVariantRow>;
        Relationships: [];
      };
      product_images: {
        Row: ProductImageRow;
        Insert: Partial<ProductImageRow> & Pick<ProductImageRow, 'product_id' | 'url'>;
        Update: Partial<ProductImageRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
