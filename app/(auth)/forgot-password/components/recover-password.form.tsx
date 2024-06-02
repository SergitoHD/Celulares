"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendResetEmail} from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RecoverPassswordForm = () => {

    const [isLoading, setisLoading] = useState<boolean>(false);
    const router = useRouter();

    {/* ============================ Formulario ======================= */}
    const formSquema=z.object({
        email: z.string().email('Formato de correo no válido. Ejemplo: user@example.com').min(1,{
            message: 'Este campo es obligatorio'
        })
    })

    const form = useForm<z.infer<typeof formSquema>>({
        resolver: zodResolver(formSquema),
        defaultValues: {
            email: ''
        }
    })

    const {register, handleSubmit, formState}=form;
    const {errors}=formState;

    //Accion de ingresar
    const onSubmit=async(user: z.infer<typeof formSquema>)=>{
        setisLoading(true);

        try {
            await sendResetEmail(user.email);
            toast.success('Correo enviado exitosamente');
            router.push('/');
        } catch (error: any) {
            toast.error(error.message, {duration:2500});
        }finally{
            setisLoading(false);
        }
    }

    return (
        <div className="md:border border-solid border-gray-300 rounded-xl p-10">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
                <p className="text-sm text-muted-foreground">Introduce tu email y te enviaremos un correo para cambiar tu contraseña</p>
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

                    {/* ============================ Ingresar ======================= */}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading&&(
                       <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                    )}Recuperar</Button>

                </div>
            </form>

            {/* ============================ Volver ======================= */}
            <p className="text-center text-sm text-muted-foreground mt-3">
                {" "}
                <Link href="/" className="underline underline-offset-4 hover:text-primary">
                    Regresar
                </Link>
            </p>


        </div>
    );

}
export default RecoverPassswordForm;