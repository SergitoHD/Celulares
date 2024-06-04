import { Timestamp } from "firebase/firestore";
import { ItemImage } from "./item-image.interface";

export interface Product{
    id?: string;
    image: ItemImage;
    name: string;
    price: number;
    quantity: number;
    createdAt?: Timestamp;
}

