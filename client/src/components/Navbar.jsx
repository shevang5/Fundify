import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, PlusSquare, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tight">
                COMMUNITY<span className="text-gray-800">FUND</span>
            </Link>

            <div className="flex items-center gap-6">
                {/* Desktop / tablet */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/create" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 font-medium">
                                <PlusSquare size={20} /> Create
                            </Link>
                            {user?.isAdmin && (
                                <Link to="/admin" className="text-red-600 font-bold hover:text-red-700">
                                    Admin Panel
                                </Link>
                            )}
                            <div className="flex items-center gap-2 text-gray-800 font-semibold border-l pl-6">
                                <User size={18} /> {user.name}
                                <button onClick={logout} className="ml-4 text-gray-400 hover:text-red-500">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile: hamburger */}
                <div className="md:hidden">
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            <div className={`${open ? 'block' : 'hidden'} md:hidden absolute right-4 top-full mt-2 bg-white shadow-lg rounded-lg w-56 z-40`}>
                <div className="p-3 space-y-2">
                    {user ? (
                        <>
                            <Link to="/create" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50">
                                <PlusSquare size={16} /> Create
                            </Link>
                            {user?.isAdmin && (
                                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-red-600 font-semibold">
                                    Admin Panel
                                </Link>
                            )}
                            <div className="border-t my-1" />
                            <div className="px-3 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User size={16} /> <span className="font-medium">{user.name}</span>
                                </div>
                                <button onClick={() => { setOpen(false); logout(); }} className="text-gray-500 hover:text-red-500">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50 bg-indigo-600 text-white text-center">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;