"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, setDocument, updateUser} from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interface";

const SignUpForm = () => {

    const [isLoading, setisLoading] = useState<boolean>(false)

    {/* ============================ Formulario ======================= */ }
    const formSquema = z.object({
        uid: z.string(),
        name: z.string().min(4, {
            message: 'Debe contener al menos 4 caracteres'
        }),
        email: z.string().email('Formato de correo no válido. Ejemplo: user@example.com').min(1, {
            message: 'Este campo es obligatorio'
        }),
        password: z.string().min(6, {
            message: 'La contraseña debe contener al menos 6 caracteres'
        })
    })

    const form = useForm<z.infer<typeof formSquema>>({
        resolver: zodResolver(formSquema),
        defaultValues: {
            uid: '',
            name: '',
            email: '',
            password: ''
        }
    })

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    //Accion de ingresar
    const onSubmit = async (user: z.infer<typeof formSquema>) => {
        console.log(user);
        setisLoading(true);

        try {
            let res = await createUser(user);
            await updateUser({displayName: user.name});
            user.uid = res.user.uid;
            await createUserInDB(user as User);
        } catch (error: any) {
            toast.error(error.message, { duration: 2500 });
        } finally {
            setisLoading(false);
        }
    }
    //Crear un usuario en la base de datos de Firebase
    const createUserInDB= async(user: User)=>{
        const path= `users/${user.uid}`;
        setisLoading(true);
        try {
            delete user.password;
            await setDocument(path, user);
            toast(`Bienvenido, ${user.name}`, {icon: '🖐'});
        } catch (error: any) {
            toast.error(error.message, { duration: 2500 });
        }finally{
            setisLoading(false);
        }
    }

    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Registrarse</h1>
                <p className="text-sm text-muted-foreground">Llena los campos según se te indica</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grip gap-2">
                    {/* ============================ Nombre ======================= */}
                    <div className="mb-3">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            {...register("name")}
                            id="name"
                            placeholder="Aldo Valencia"
                            type="text"
                            autoComplete="name"
                        />
                        <p className="form-error">{errors.name?.message}</p>
                    </div>
                    {/* ============================ Email ======================= */}
                    <div className="mb-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            {...register("email")}
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                        />
                        <p className="form-error">{errors.email?.message}</p>
                    </div>

                    {/* ============================ Contraseña ======================= */}
                    <div className="mb-3">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            {...register("password")}
                            id="password"
                            placeholder="**********"
                            type="password"
                        />
                        <p className="form-error">{errors.password?.message}</p>
                    </div>

                    {/* ============================ Ingresar ======================= */}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}Registrarse</Button>

                </div>
            </form>

            {/* ============================ Registrarse ======================= */}
            <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/" className="underline underline-offset-4 hover:text-primary">
                    Ingresa
                </Link>
            </p>


        </>
    );
}
export default SignUpForm;