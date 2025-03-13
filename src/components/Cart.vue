<template>
    <div class="overlay" @click.self="closeCart">
        <div class="cart-container">
            <div class="flex">
                <h2>Cart</h2>
                <X @click="closeCart" />
            </div>

            <div class="cart-header">
                <div class="header-item">Product</div>
                <div class="header-item">Price</div>
                <div class="header-item">Quantity</div>
                <div class="header-item">Total</div>
            </div>

            <div class="cart-item" v-for="item in cartItems" :key="item.id">
                <div class="product-info">
                    <img :src="item.image" alt="Product image" class="product-img">
                    <div>
                        <p>{{ item.title }}</p>
                        <p class="product-desc">{{ item.description }}</p>
                    </div>
                </div>
                <div class="price">${{ item.price }}</div>
                <div class="quantity-control">
                    <button @click="decreaseQuantity(item)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)">+</button>
                </div>
                <div class="total">${{ item.price * item.quantity }}</div>
                <button @click="removeItem(item)" class="remove-btn">✕</button>
            </div>

            <div class="cart-summary">
                <p>Total: ${{ totalAmount }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { X } from 'lucide-vue-next';

const props = defineProps({
    closeCart: Function
});

const store = useStore();

const cartItems = computed(() => store.getters.cartItems);


const totalAmount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});


const increaseQuantity = (item) => {
    store.dispatch('increaseQuantity', item.title);
};

const decreaseQuantity = (item) => {
    store.dispatch('decreaseQuantity', item.title);
};

const removeItem = (item) => {
    store.dispatch('removeFromCart', item.title);
};
</script>

<style scoped>

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}


.cart-container {
    width: 90%;
    max-width: 600px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    height: 80vh;
    overflow-y: scroll;
    overflow-x: hidden;
}


.cart-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 50px;
    text-align: left;
    font-weight: bold;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
}

.header-item {
    padding: 10px;
}


.cart-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 50px;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #ddd;
}

.product-info {
    display: flex;
    align-items: center;
}

.product-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 5px;
}

.product-desc {
    font-size: 0.9rem;
    color: #666;
}

.price,
.quantity-control,
.total {
    text-align: center;
}

.quantity-control {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.quantity-control button {
    background-color: #4444de;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.remove-btn {
    background-color: transparent;
    border: none;
    color: red;
    font-size: 1.2rem;
    cursor: pointer;
}

.cart-summary {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 20px;
}


@media (max-width: 768px) {
    .cart-header,
    .cart-item {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
    }

    .header-item,
    .product-info,
    .price,
    .quantity-control,
    .total {
        text-align: left;
    }

    .quantity-control {
        justify-content: flex-start;
    }

    .remove-btn {
        grid-column: 1 / -1;
        text-align: right;
    }
}
</style>
