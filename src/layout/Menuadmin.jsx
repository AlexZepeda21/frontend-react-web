import React from 'react';
import { Home, TrendingUp, Users, Library, History, Video, Clock, ThumbsUp, Search, Camera, Grid, Bell, User, TicketPercent, MenuIcon, Menu, Disc2Icon } from 'lucide-react';
import { Outlet } from 'react-router-dom'; // Importar Outlet

const Layout = () => {
    return (
        <div className="flex h-screen">
            <div className="w-64 border-r bg-white">
                <div className="m-3">
                    <img src="https://www.itca.edu.sv/wp-content/themes/elaniin-itca/images/logoColor.png" alt="" />
                </div>
                <div className="p-4">
                    <a href="/" className="flex items-center space-x-2 font-bold text-xl text-red-600 mb-6">
                        <span>MENU DE ADMIN</span>
                    </a>
                    <nav className="space-y-2 ">
                        <NavItem href="/" icon={<Home className="w-4 h-4" />} text="Inicio" />
                        <NavItem href="/../register-form" icon={<Users className="w-4 h-4" />} text="Agregar usuarios" />
                        <div className="pt-4"></div>
                        <NavItem href="/../admin/categoria_recetas" icon={<Library className="w-4 h-4" />} text="Recetas" />
                        <NavItem href="/menu" icon={<Disc2Icon className="w-4 h-4" />} text="Platos" />
                        <div className="pt-4"></div>
                        <NavItem href="/history" icon={<History className="w-4 h-4" />} text="Historial de reservas" />
                        <NavItem href="/watch-later" icon={<Clock className="w-4 h-4" />} text="Watch later" />
                        <NavItem href="/liked-videos" icon={<ThumbsUp className="w-4 h-4" />} text="Liked videos" />
                    </nav>
                </div>
            </div>
            <div className="flex-1">
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="w-96">
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <HeaderButton icon={<Grid className="h-4 w-4" />} />
                        <HeaderButton icon={<Bell className="h-4 w-4" />} />
                        <HeaderButton icon={<User className="h-4 w-4" />} />
                    </div>
                </header>

                {/* Aquí agregamos el Outlet */}
                <main className="p-4">
                    <Outlet /> {/* Este es el lugar donde se cargará el contenido dinámico de las rutas hijas */}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ href, icon, text }) => (
    <a
        href={href}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
    >
        {icon}
        <span>{text}</span>
    </a>
);

const HeaderButton = ({ icon }) => (
    <button className="p-2 rounded-full hover:bg-gray-100">
        {icon}
    </button>
);

export default Layout;
