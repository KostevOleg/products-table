export type ProductsQuery = {
  page: number;
  limit: number;
  category: string | null;
  sortBy: string | null;
  order: 'asc' | 'desc' | null;
};
