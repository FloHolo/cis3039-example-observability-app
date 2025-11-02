import { ref, type Ref } from 'vue';
import { appConfig } from '@/config/appConfig';

export type Product = {
  id: string;
  name: string;
  pricePence?: number;
  description?: string;
};

const API_BASE = appConfig.apiBaseUrl;

export function useProducts() {
  const products: Ref<Product[]> = ref([]);
  const loading = ref(false);
  const error: Ref<string | null> = ref(null);

  const fetchProducts = async (force = false) => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const url = new URL('products', API_BASE).toString();
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok)
        throw new Error(
          `Failed to fetch products: ${res.status} ${res.statusText}`,
        );
      const data: Product[] = await res.json();
      products.value = Array.isArray(data) ? data : [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  return { products, loading, error, fetchProducts };
}
