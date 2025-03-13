import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        productsCategories:[],
        productsBrands:[],
        productsReturnPolicys:[],
        catalogs: [],
        search: '',
        filteredProducts: [],
        filters: {
            categories: [],
            brands: [],
            returnPolicys: []
        },
        cart: []
    },
    mutations: {
        setCatalogs(state, catalogs) {
            state.catalogs = catalogs;
        },
        setCategories(state, categories) {
            state.productsCategories = categories;
        },
        setBrands(state, brands) {
            state.productsBrands = brands;
        },
        setReturnPolicys(state, returnPolicys) {
            state.productsReturnPolicys = returnPolicys;
        },
        setSearch(state, search) {
            state.search = search;
        },
        setFilters(state, filters) {
            state.filters = { ...state.filters, ...filters };
        },
        setFilteredProducts(state, products) {
            state.filteredProducts = products;
        },
        addToCart(state, product) {
            const existingItem = state.cart.find(item => item.title === product.title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({ ...product, quantity: 1 }); 
            }
            console.log(state.cart)
        },
        removeFromCart(state, productId) {
            state.cart = state.cart.filter(item => item.title !== productId); 
        },
        increaseQuantity(state, productId) {
            const item = state.cart.find(item => item.title === productId);
            if (item) {
                item.quantity += 1; 
            }
        },
        decreaseQuantity(state, productId) {
            const item = state.cart.find(item => item.title === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1; 
            }
        }
    },
    actions: {
        fetchCatalogs({ commit }) {
            axios.get('https://dummyjson.com/products')
                .then(response => {
                    const categoryMap = new Map();
                    const brandMap = new Map();
                    const returnPolicyMap = new Map();
                    
                    response.data.products.forEach(product => {
                        if (product.category && !categoryMap.has(product.category)) {
                            categoryMap.set(product.category, { id: categoryMap.size + 1, name: product.category });
                        }
                        if (product.brand && !brandMap.has(product.brand)) {
                            brandMap.set(product.brand, { id: brandMap.size + 1, name: product.brand });
                        }
                        if (product.returnPolicy && !returnPolicyMap.has(product.returnPolicy)) {
                            returnPolicyMap.set(product.returnPolicy, { id: returnPolicyMap.size + 1, name: product.returnPolicy });
                        }
                    });
                    commit('setCategories', Array.from(categoryMap.values()))
                    commit('setReturnPolicys', Array.from(returnPolicyMap.values()))
                    commit('setBrands', Array.from(brandMap.values()))
                    commit('setCatalogs', response.data.products);
                    commit('setFilteredProducts', response.data.products);
                });
        },
        updateSearch({ commit, dispatch }, search) {
            commit('setSearch', search);  
            dispatch('filterProducts');  
        },
        updateFilters({ commit, dispatch }, filters) {
            commit('setFilters', filters);
            dispatch('filterProducts'); 
        },
        filterProducts({ state, commit }) {
            let filtered = [...state.catalogs];

        
            if (state.search) {
                filtered = filtered.filter(product =>
                    product.title.toLowerCase().includes(state.search.toLowerCase()) ||
                    product.description.toLowerCase().includes(state.search.toLowerCase())
                );
            }

           
            if (state.filters.categories.length > 0) {
                filtered = filtered.filter(product =>
                    state.filters.categories.includes(product.category)
                );
            }

        
            if (state.filters.brands.length > 0) {
                filtered = filtered.filter(product =>
                    state.filters.brands.includes(product.brand)
                );
            }

            if (state.filters.returnPolicys.length > 0) {
                filtered = filtered.filter(product =>
                    state.filters.returnPolicys.includes(product.returnPolicy)
                );
            }

            commit('setFilteredProducts', filtered);
        },       
        addToCart({ commit }, product) {
            commit('addToCart', product);  
        },
        removeFromCart({ commit }, productId) {
            commit('removeFromCart', productId);
        },
        increaseQuantity({ commit }, productId) {
            commit('increaseQuantity', productId); 
        },
        decreaseQuantity({ commit }, productId) {
            commit('decreaseQuantity', productId); 
        }
    },
    getters: {
        filteredProducts: (state) => state.filteredProducts,
        categories: (state) => state.productsCategories,
        brands: (state) => state.productsBrands,
        returnPolicys: (state) => state.productsReturnPolicys,
        cartItems: (state) => state.cart, 
        cartTotal: (state) => {
            return state.cart.reduce((total, item) => total + item.price * item.quantity, 0); 
        }
    }
});
