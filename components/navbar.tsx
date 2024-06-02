import Logo from "@/components/logo";
import { ProfileDropdown } from "./profile-dropdown";

const Navbar = ()=>{
    return (
        <div className="flex justify-between mx-6 mb-10 lg:mx-20 py-6 border-b border-solid border-gray-200 md:border-b-0">
            <Logo/>
            <div className="md:mr-10 ">
                <ProfileDropdown/>
            </div>
        </div>
    );
}
export default Navbar;