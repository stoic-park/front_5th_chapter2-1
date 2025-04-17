import React from 'react';
import { CartItem as CartItemType } from '../types';
import { CartItem } from './CartItem';

interface CartItemListProps {
    cartItems: CartItemType[];
    onQuantityChange: (productId: string, change: number) => void;
    onRemove: (productId: string) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({ cartItems, onQuantityChange, onRemove }) => {
    return (
        <div id="cart-items">
            {cartItems.map((item) => (
                <CartItem key={item.product.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />
            ))}
        </div>
    );
};
