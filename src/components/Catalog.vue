<template>
    <ul class="catalog-list">
        <li class="catelog-list-item" v-for="product in filteredProducts" :key="product.id">
            <CatalogCard :title="product.title" :description="product.description" :image="product.images[0]"
                :price="product.price" @add-to-cart="handleAddToCart" />
        </li>
    </ul>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import CatalogCard from './CatalogCard.vue';

const store = useStore();
const filteredProducts = computed(() => store.getters.filteredProducts);

const handleAddToCart = (product) => {
    store.dispatch('addToCart', product); 
}

onMounted(() => {
    store.dispatch('fetchCatalogs');
});
</script>

<style scoped>
@media (max-width: 768px) {
    .total-product {
        flex-direction: column;
        align-items: flex-start;
    }
}

.filter-wrapper {
    position: absolute;
    height: 100%;
    width: 50%;
    background: white;
    right: 0;
    border: 1px solid;
    top: 0;
    bottom: 0;
    padding: 10px;
}

.catalog-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    gap: 10px;
}

.catelog-list-item {
    list-style-type: none;
    border: 1px solid grey;
    border-radius: 5px;
    flex-basis: calc(33% - 50px);
    padding: 20px;
}

@media (max-width: 768px) {
    .catelog-list-item {
        flex-basis: 100%;
    }
}


.filter {
    gap: 10px;
}

.filter-options {
    display: flex;
    flex-direction: column;
}

.filter-section {
    border-bottom: 1px solid black;
}
</style>
