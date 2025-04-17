import { useState } from 'react';
import { Product, CartItem } from '../types';

export const useCart = (initialProducts: Product[]) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    const handleAddToCart = () => {
        if (!selectedProductId) return;

        const product = products.find((p) => p.id === selectedProductId);
        if (!product || product.quantity <= 0) return;

        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.product.id === selectedProductId);
            if (existingItem) {
                return prev.map((item) =>
                    item.product.id === selectedProductId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });

        setProducts((prev) => prev.map((p) => (p.id === selectedProductId ? { ...p, quantity: p.quantity - 1 } : p)));
    };

    const handleQuantityChange = (productId: string, change: number) => {
        setCartItems((prev) => {
            const item = prev.find((item) => item.product.id === productId);
            if (!item) return prev;

            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
                const product = products.find((p) => p.id === productId);
                if (product) {
                    setProducts((prevProducts) =>
                        prevProducts.map((p) =>
                            p.id === productId ? { ...p, quantity: p.quantity + item.quantity } : p
                        )
                    );
                }
                return prev.filter((item) => item.product.id !== productId);
            }

            const product = products.find((p) => p.id === productId);
            if (product && newQuantity > product.quantity + item.quantity) {
                alert('재고가 부족합니다.');
                return prev;
            }

            return prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
        });
    };

    const handleRemoveItem = (productId: string) => {
        setCartItems((prev) => {
            const item = prev.find((item) => item.product.id === productId);
            if (item) {
                setProducts((prevProducts) =>
                    prevProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + item.quantity } : p))
                );
            }
            return prev.filter((item) => item.product.id !== productId);
        });
    };

    return {
        products,
        setProducts,
        cartItems,
        selectedProductId,
        setSelectedProductId,
        handleAddToCart,
        handleQuantityChange,
        handleRemoveItem,
    };
};
