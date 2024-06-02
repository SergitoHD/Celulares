import { Metadata } from "next";
import Navbar from "../../components/navbar";
import Items from "./components/items";

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Gestiona tus productos'
}

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className="md:border border-solid border-gray-300 rounded-3xl p-3 md:m-6 lg:mx-36">
                <Items />
            </div>

        </>
    );
}
export default Dashboard;