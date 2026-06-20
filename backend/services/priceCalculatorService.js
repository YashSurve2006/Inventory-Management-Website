export const calculateTotal = (components) => {

    let total = 0;

    components.forEach((c) => {
        if (c && c.price) {
            total += Number(c.price);
        }
    });

    return total;

};