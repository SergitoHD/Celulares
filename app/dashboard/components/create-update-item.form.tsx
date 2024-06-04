"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CirclePlus } from "lucide-react"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDocument, createUser, setDocument, updateDocument, updateUser, uploadBase64 } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interface";
import { ItemImage } from "@/interfaces/item-image.interface"
import DragAndDropImage from "@/components/drag-and-drop-image"
import { useUser } from "@/hooks/use-user"
import { Product } from "@/interfaces/products.interface"
import Image from "next/image"

interface CreateUpdateItemProps{
    children: React.ReactNode;
    itemToUpdate?: Product
    getItems: () => Promise<void>
}

export function CreateUpdateItem({children, itemToUpdate, getItems}:CreateUpdateItemProps) {

    const user = useUser();
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false);
    const [image, setImage] = useState<string>('')

    {/* ============================ Formulario ======================= */ }
    const formSquema = z.object({
        image: z.object({
            path: z.string(),
            url: z.string()
        }),
        name: z.string().min(4, {
            message: 'Debe contener al menos 4 caracteres'
        }),
        price: z.coerce.number().gte(0,"El valor mínimo debe ser 0"),
        quantity: z.coerce.number().gte(0,"El valor mínimo debe ser 0")
    })

    const form = useForm<z.infer<typeof formSquema>>({
        resolver: zodResolver(formSquema),
        defaultValues: itemToUpdate ? itemToUpdate :{
            image: { } as ItemImage,
            name: '',
            price: undefined,
            quantity: undefined
        }
    })

    const { register, handleSubmit, formState, setValue } = form;
    const { errors } = formState;

    //Actualizar imagen
    const handleImage = (url: string)=>{
        let path= itemToUpdate ? itemToUpdate.image.path : `${user?.uid}/${Date.now}`;
        setValue('image',{url,path})
        setImage(url);
    }

    useEffect(() => {
        if(itemToUpdate) setImage(itemToUpdate.image.url);
    }, [open])
    

    //Accion de crear o actualizar un producto
    const onSubmit = async (item: z.infer<typeof formSquema>) => {

        if(itemToUpdate) updateItem(item);
        else createItem(item);
    }
    //Crear un producto en la base de datos de Firebase
    const createItem = async (item: Product) => {
        const path = `productos`;
        setisLoading(true);
        try {
            const base64 = item.image.url;
            const imagePath = item.image.path;
            const imageUrl = await uploadBase64(imagePath, base64);
            item.image.url = imageUrl;
            await addDocument(path, item);
            toast.success('Producto agregado exitosamente');
            getItems();
            setOpen(false);
            form.reset();
            setImage('');
        } catch (error: any) {
            toast.error(error.message, { duration: 2500 });
        } finally {
            setisLoading(false);
        }
    }

    //Actualizar producto
    const updateItem = async (item: Product) => {
        const path = `productos/${itemToUpdate?.id}`;
        setisLoading(true);
        try {
            if(itemToUpdate?.image.url !== item.image.url){
                const base64 = item.image.url;
                const imagePath = item.image.path;
                const imageUrl = await uploadBase64(imagePath, base64);
                item.image.url = imageUrl;
            }

            await updateDocument(path, item);
            toast.success('Producto actualizado exitosamente');
            getItems();
            setOpen(false);
            form.reset();
            setImage('');
        } catch (error: any) {
            toast.error(error.message, { duration: 2500 });
        } finally {
            setisLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{itemToUpdate ? 'Actualizar producto' : 'Agregar producto'}</DialogTitle>
                    <DialogDescription>
                        Gestiona tu producto con la siguiente información
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grip gap-2">
                        {/* ============================ Imagen ======================= */}
                        <div className="mb-3">
                            <Label htmlFor="image">Imagen</Label>
                            {image ? (
                                <div className="text-center">
                                    <Image
                                    width={1000}
                                    height={1000}
                                    src={image}
                                    alt="item-image"
                                    className="w-[50%] m-auto"
                                />
                                <Button 
                                type="button"
                                onClick={()=> handleImage('')}
                                disabled={isLoading}
                                className="mt-6">Borrar imagen</Button>
                                </div>
                                
                            ):(
                                <DragAndDropImage handleImage={handleImage}/>
                            )}
                            
                        </div>
                        {/* ============================ Nombre ======================= */}
                        <div className="mb-3">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                {...register("name")}
                                id="name"
                                placeholder="Producto"
                                type="text"
                                autoComplete="name"
                            />
                            <p className="form-error">{errors.name?.message}</p>
                        </div>
                        {/* ============================ Precio ======================= */}
                        <div className="mb-3">
                            <Label htmlFor="price">Precio</Label>
                            <Input
                                {...register("price")}
                                id="price"
                                placeholder="$0.00MXN"
                                step="0.01"
                                type="number"
                            />
                            <p className="form-error">{errors.price?.message}</p>
                        </div>

                        {/* ============================ Cantidad ======================= */}
                        <div className="mb-3">
                            <Label htmlFor="quantity">Cantidad</Label>
                            <Input
                                {...register("quantity")}
                                id="quantity"
                                placeholder="0"
                                step="1"
                                type="number"
                            />
                            <p className="form-error">{errors.quantity?.message}</p>
                        </div>

                        {/* ============================ Ingresar ======================= */}

                        <DialogFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}{itemToUpdate ? 'Actualizar' : 'Agregar'}</Button>
                        </DialogFooter>

                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
