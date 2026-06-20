const CART_KEY = "ix_cart";

export function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(p => p.id === product.id);

    if (existing) {
        if (existing.qty + 1 > product.quantity) return cart;
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
}

export function updateQty(id, qty) {
    const cart = getCart().map(p =>
        p.id === id ? { ...p, qty } : p
    );
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
}

export function removeItem(id) {
    const cart = getCart().filter(p => p.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
}
