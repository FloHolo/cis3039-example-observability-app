<script setup lang="ts">
import { onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';

const { products, loading, error, fetchProducts } = useProducts();

onMounted(() => {
  fetchProducts();
});

const formatPrice = (p?: number) =>
  p === undefined ? '—' : `£${(p / 100).toFixed(2)}`;
</script>

<template>
  <div class="products-view">
    <h1>Products</h1>

    <div v-if="loading" class="loading">Loading products…</div>
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="fetchProducts(true)">Retry</button>
    </div>
    <div v-else-if="products.length === 0" class="empty">
      No products found.
    </div>

    <ul v-else class="list">
      <li v-for="p in products" :key="p.id" class="card">
        <div class="row">
          <strong class="name">{{ p.name }}</strong>
          <span class="price">{{ formatPrice(p.pricePence) }}</span>
        </div>
        <p v-if="p.description" class="desc">{{ p.description }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.products-view {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}
.list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.name {
  color: #1f2937;
}
.price {
  color: #065f46;
  font-weight: 600;
}
.desc {
  color: #6b7280;
  margin-top: 0.5rem;
}
.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
}
.error button {
  margin-top: 0.5rem;
}
</style>
