import React, { useState } from 'react';
import { Home, Users, Library, History, Clock, ThumbsUp, Search, Grid, Bell, User, Disc2Icon } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    const handleLogout = () => {
        // Lógica para cerrar sesión
        console.log("Cerrar sesión");
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 border-r bg-red-50">
                <div className="m-3">
                    <img src="https://virtual3.itca.edu.sv/pluginfile.php/682735/mod_folder/intro/ITCA_2024_FC%20%281%29.jpg?1728999031342" alt="" />
                </div>
                <div className="p-4">
                    <a href="/" className="flex items-center space-x-2 font-bold text-xl text-red-600 mb-6">
                        <span>MENU DE ADMIN</span>
                    </a>
                    <nav className="space-y-2">
                        <NavItem href="/" icon={<Home className="w-4 h-4 text-red-600" />} text="Inicio" />
                        <NavItem href="/../register-form" icon={<Users className="w-4 h-4 text-red-600" />} text="Agregar usuarios" />
                        <div className="pt-4"></div>
                        <NavItem href="/../admin/categoria_recetas" icon={<Library className="w-4 h-4 text-red-600" />} text="Recetas" />
                        <NavItem href="/../admin/productos" icon={<Disc2Icon className="w-4 h-4 text-red-600" />} text="Productos" />
                        <div className="pt-4"></div>
                        <NavItem href="/history" icon={<History className="w-4 h-4 text-red-600" />} text="Historial de reservas" />
                        <NavItem href="/watch-later" icon={<Clock className="w-4 h-4 text-red-600" />} text="Watch later" />
                        <NavItem href="/liked-videos" icon={<ThumbsUp className="w-4 h-4 text-red-600" />} text="Liked videos" />
                    </nav>
                </div>
            </div>
            <div className="flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-red-600 text-white">
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
                    <div className="flex items-center space-x-4 relative">
                        <HeaderButton icon={<Grid className="h-4 w-4 text-white" />} />
                        <HeaderButton icon={<Bell className="h-4 w-4 text-white" />} />

                        {/* Usuario con imagen y menú desplegable */}
                        <div className="relative">
                            <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={toggleUserMenu}
                            >
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="Usuario"
                                    className="w-8 h-8 rounded-full"
                                />
                                <User className="h-4 w-4 text-white" />
                            </div>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                                    >
                                        Perfil
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ href, icon, text }) => (
    <a
        href={href}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-100 text-sm text-red-600"
    >
        {icon}
        <span>{text}</span>
    </a>
);

const HeaderButton = ({ icon }) => (
    <button className="p-2 rounded-full hover:bg-red-500">
        {icon}
    </button>
);

export default Layout;
