import Logo from "@/components/logo";
import { Metadata } from "next";
import RecoverPassswordForm from "./components/recover-password.form";

export const metadata: Metadata = {
    title: 'Recuperar contraseña',
    description: 'Cambia tu contraseña por una más segura y fácil de recordar'
}

const ForgotPassword = () => {
    return (
        <div className="pt-10 lg:p-8 flex items-center md:h-[70vh]">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <RecoverPassswordForm />
            </div>
        </div>
    );
}
export default ForgotPassword;