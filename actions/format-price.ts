import { Currency } from "lucide-react";

export const formatPrice = (price:number)=>{
    const fixedPrice = parseFloat(price.toFixed(2));
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",

    }).format(fixedPrice) + ' MXN'
}