<template>
    <div class="search-container">
        <div class="search-wrapper">
        <div class="relative flex search-box">
            <Search size="20" class="absolute search-icon" />
            <input class="search-input" type="text" v-model="search" @input="updateSearch" placeholder="Search for Products, Brands and More">
        </div>
        <button class="search-button">
            <Search size="20" class="button-icon" />
            Search again
        </button>
        </div>
        <div class="filter-button">
            <button class="flex filter" @click="toggleFilter">
                    <SlidersHorizontal size="15" />
                    Filters
            </button>
        </div>
        <div class="filter-wrapper" v-if="isFilterVisible">
            <div class="flex">
                <h3>All filters</h3>
                <X @click="toggleFilter" />
            </div>
            <div class="filter-section">
                <h5 @click="toggleSection('category')" class="flex">
                    Categories <span v-if="isSectionOpen.category">
                        <ChevronUp />
                    </span><span v-else>
                        <ChevronDown />
                    </span>
                </h5>
                <div v-if="isSectionOpen.category" class="filter-options">
                    <label v-for="category in categories" :key="category.id">
                        <input type="checkbox" v-model="selectedCategories" :value="category.name" />
                        {{ category.name }}
                    </label>
                </div>
            </div>
            <div class="filter-section">
                <h5 @click="toggleSection('brand')" class="flex">
                    Brand <span v-if="isSectionOpen.brand">
                        <ChevronUp />
                    </span><span v-else>
                        <ChevronDown />
                    </span>
                </h5>
                <div v-if="isSectionOpen.brand" class="filter-options">
                    <label v-for="brand in brands" :key="brand.id">
                        <input type="checkbox" v-model="selectedBrands" :value="brand.name" />
                        {{ brand.name }}
                    </label>
                </div>
            </div>
            <div class="filter-section">
                <h5 @click="toggleSection('returnPolicy')" class="flex">
                    Return Policy <span v-if="isSectionOpen.returnPolicy">
                        <ChevronUp />
                    </span><span v-else>
                        <ChevronDown />
                    </span>
                </h5>
                <div v-if="isSectionOpen.returnPolicy" class="filter-options">
                    <label v-for="returnPolicy in returnPolicys" :key="returnPolicy.id">
                        <input type="checkbox" v-model="selectedReturnPolicys" :value="returnPolicy.name" />
                        {{ returnPolicy.name }}
                    </label>
                </div>
            </div>
            <button @click="applyFilters" class="btn-apply">Apply</button>
            <button @click="clearFilters" class="btn-apply ml-3">Clear</button>
        </div>
    </div>


    <div class="flex total-product">
            <h4 v-if="search">Showing {{ filteredProducts.length }} results for "{{search}}"</h4>
            <h4 v-else>Showing {{ filteredProducts.length }} results</h4>
    </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import CatalogCard from './CatalogCard.vue';
import { Search } from 'lucide-vue-next';
import { SlidersHorizontal, X, ChevronUp, ChevronDown } from 'lucide-vue-next';


const store = useStore();
const search = computed(() => store.state.search);
const filteredProducts = computed(() => store.getters.filteredProducts);
const categories = computed(() => store.getters.categories);
const brands = computed(() => store.getters.brands);
const returnPolicys = computed(() => store.getters.returnPolicys);
const isFilterVisible = ref(false);
const isSectionOpen = ref({
    category: true,
    brand: false,
    returnPolicy: false
});

const debounceTimeout = ref(null);

const updateSearch = (event) => {
    const searchValue = event.target.value;

    if (debounceTimeout.value) {
        clearTimeout(debounceTimeout.value);
    }

    debounceTimeout.value = setTimeout(() => {
        store.dispatch('updateSearch', searchValue);
    }, 700);
};

const toggleFilter = () => {
    isFilterVisible.value = !isFilterVisible.value;
};

const toggleSection = (section) => {
    isSectionOpen.value[section] = !isSectionOpen.value[section];
};

const selectedCategories = ref([]);
const selectedBrands = ref([]);
const selectedReturnPolicys =  ref([]);

const applyFilters = () => {
    store.dispatch('updateFilters', {
        categories: selectedCategories.value,
        brands: selectedBrands.value,
        returnPolicys: selectedReturnPolicys.value
    });
    toggleFilter();
};

const clearFilters = () => {
    selectedCategories.value = [];
    selectedBrands.value = [];
    selectedReturnPolicys.value = [];
    store.dispatch('updateFilters', {
        categories: selectedCategories.value,
        brands: selectedBrands.value,
        returnPolicys: selectedReturnPolicys.value
    });
    toggleFilter();
};


onMounted(() => {
    store.dispatch('fetchCatalogs');
});
</script>

<style scoped>
.search-container {
    display: flex;
    gap: 70px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.search-wrapper{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 10px;
    flex: 1;
}

.search-box {
    position: relative;
    flex: 1;
}

.search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
}

.search-input {
    padding: 10px 10px 10px 35px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}

.filter-button{
    padding:10px;
}

.filter-button button{
    width: 100%;
    background-color: #297a52;
}

.search-button {
    background-color: red;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s ease;
}

.search-button:hover {
    background-color: darkred;
}

.button-icon {
    margin-right: 5px;
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

.filter-wrapper {
    position: absolute;
    height: fit-content;
    width: 30%;
    background: white;
    right: 0;
    border: 1px solid;
    top: 0;
    bottom: 0;
    padding: 10px;
}


@media (max-width: 768px) {
    .catelog-list-item {
        flex-basis: 100%;
    }
}

@media (max-width: 768px) {
    .total-product {
        flex-direction: column;
        align-items: flex-start;
    }
}
@media (max-width: 600px) {
    .search-container {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .search-button {
        width: 100%;
        justify-content: center;
    }
}

</style>
