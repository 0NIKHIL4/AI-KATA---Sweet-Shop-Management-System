import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Candy, LogOut, User, Shield, Plus, Menu, X, ChevronDown } from 'lucide-react';
import SweetFormDialog from '@/components/sweets/SweetFormDialog';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b-2 border-border/50 shadow-soft">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full gradient-candy flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Candy className="w-5 h-5 text-candy-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-primary hidden sm:block">
              Sweet Shop
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Button variant="candy" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sweet
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    {isAdmin ? (
                      <Shield className="h-4 w-4 text-candy" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <span>Role</span>
                  <Badge variant={isAdmin ? 'default' : 'secondary'} className={isAdmin ? 'gradient-candy text-candy-foreground' : ''}>
                    {user?.role}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                {isAdmin ? (
                  <Shield className="h-5 w-5 text-candy" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Badge variant={isAdmin ? 'default' : 'secondary'} className={isAdmin ? 'gradient-candy text-candy-foreground' : ''}>
                {user?.role}
              </Badge>
            </div>

            {isAdmin && (
              <Button variant="candy" className="w-full" onClick={() => {
                setIsAddDialogOpen(true);
                setIsMobileMenuOpen(false);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sweet
              </Button>
            )}

            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </header>

      <SweetFormDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}
