import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Keyboard, Mic, LogOut, User } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import LoginModal from "@/components/auth/LoginModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ComingSoonModal from "@/components/modals/ComingSoonModal";

interface NavbarProps {
  forceOpaque?: boolean;
}

const Navbar = ({ forceOpaque = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },

    { href: '/practice', label: 'Typing Test' },
    { href: '/#voice', label: 'Voice Practice', isComingSoon: true },
    { href: '/#benefits', label: 'Benefits' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; isComingSoon?: boolean }) => {
    if (link.isComingSoon) {
      e.preventDefault();
      setIsComingSoonOpen(true);
      setIsMobileMenuOpen(false);
    } else if (link.href === '/practice' && !isAuthenticated) {
      e.preventDefault();
      openLoginModal();
      setIsMobileMenuOpen(false);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || forceOpaque ? 'glass-strong py-3' : 'bg-transparent py-5'
        }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Keyboard className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
            <Mic className="w-4 h-4 text-accent absolute -bottom-1 -right-1" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-foreground">Type</span>
            <span className="gradient-text">Speak</span>
            <span className="text-muted-foreground font-medium"> Pro</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              onClick={(e) => link.isComingSoon ? handleNavClick(e, link) : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-10 w-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all hover:opacity-80 ring-2 ring-white/10">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="default" size="sm" onClick={openLoginModal}>
                Sign In
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-strong mt-2 mx-4 rounded-xl p-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-border my-2" />
            <div className="pt-2 flex justify-center">
              {isAuthenticated ? (
                <Button className="w-full" variant="destructive" onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}>
                  Log out
                </Button>
              ) : (
                <Button className="w-full" onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLoginModal();
                }}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
    </header>
  );
};

export default Navbar;
