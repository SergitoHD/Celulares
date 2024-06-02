"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const SingIngForm = () => {

    const [isLoading, setisLoading] = useState<boolean>(false)

    {/* ============================ Formulario ======================= */}
    const formSquema=z.object({
        email: z.string().email('Formato de correo no válido. Ejemplo: user@example.com').min(1,{
            message: 'Este campo es obligatorio'
        }),
        password: z.string().min(6,{
            message: 'La contraseña debe contener al menos 6 caracteres'
        })
    })

    const form = useForm<z.infer<typeof formSquema>>({
        resolver: zodResolver(formSquema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const {register, handleSubmit, formState}=form;
    const {errors}=formState;

    //Accion de ingresar
    const onSubmit=async(user: z.infer<typeof formSquema>)=>{
        setisLoading(true);

        try {
            let res = await signIn(user);
        } catch (error: any) {
            toast.error(error.message, {duration:2500});
        }finally{
            setisLoading(false);
        }
    }

    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Iniciar Sesión</h1>
                <p className="text-sm text-muted-foreground">Introduce tu email y tu contraseña para acceder</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grip gap-2">
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

                    <div className="text-end mb-6">
                        <Link href="/forgot-password" className="underline text-muted-foreground underline-offset-4 hover:text-primary text-sm">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>


                    {/* ============================ Ingresar ======================= */}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading&&(
                       <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                    )}Ingresar</Button>

                </div>
            </form>

            {/* ============================ Registrarse ======================= */}
            <p className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
                    Regístrate
                </Link>
            </p>


        </>
    );
}
export default SingIngForm;