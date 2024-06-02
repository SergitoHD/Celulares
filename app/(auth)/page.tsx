import Logo from "@/components/logo";
import { Metadata } from "next";
import SingIngForm from "./components/sign-in.form";

export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Ingresa para tener acceso a tu lista de productos'
}

const AuthPage = ()=>{
    return (<div className="flex justify-center items-center md:h-[95vh] md:px-10 lg:px-26">
        <div className="container h-[85vh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">


        {/* ============================ Imagen ======================= */}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
            <div className="bg-auth absolute inset-0"></div>
            <Logo/>
            <div className="relative z-20 mt-auto">
                <p className="text-lg">
                    Innovación y estilo en cada clic.   
                </p>
                <footer className="text-sm">
                    Entra ahora
                </footer>
            </div>
        </div>

        {/* =================================================== */}
        <div className="pt-10 lg:p-8 flex items-center md:h-[70vh]">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <SingIngForm/>
            </div>
        </div>
        </div>
    </div>
);
}
export default AuthPage;