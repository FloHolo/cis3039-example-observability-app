import { ref, type Ref } from 'vue';
import { appConfig } from '@/config/appConfig';
import { useTelemetry } from '@/composables/useTelemetry';

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
  const { trackEvent, trackException, trackMetric, trackDependency } =
    useTelemetry();

  const fetchProducts = async (force = false) => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;

    const startTime = Date.now();
    let success = false;
    let statusCode: number | undefined;

    try {
      const url = new URL('products', API_BASE).toString();

      // Track that we're fetching products
      trackEvent('FetchProducts', { force });

      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      statusCode = res.status;

      if (!res.ok)
        throw new Error(
          `Failed to fetch products: ${res.status} ${res.statusText}`,
        );

      const data: Product[] = await res.json();
      products.value = Array.isArray(data) ? data : [];
      success = true;

      // Track successful data retrieval
      trackMetric('ProductsCount', products.value.length);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';

      // Track the exception
      if (e instanceof Error) {
        trackException(e, { context: 'fetchProducts' });
      }
    } finally {
      const duration = Date.now() - startTime;
      loading.value = false;

      // Track the API dependency call
      trackDependency(
        'GET /products',
        API_BASE + 'products',
        duration,
        success,
        statusCode,
      );
    }
  };

  return { products, loading, error, fetchProducts };
}
