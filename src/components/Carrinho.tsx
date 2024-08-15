import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Cart: React.FC = () => {
    return (
        <div className="flex">
            <button className="flex items-center space-x-2 bg-gray-200 px-2 rounded-md hover:bg-gray-300">
                <ShoppingCart size={24} />
                <span>Carrinho</span>
            </button>
        </div>
    );
};

export default Cart;
