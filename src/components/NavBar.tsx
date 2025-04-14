
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, HelpCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavBarProps {
  toggleSidebar: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/d8895f72-22c4-497d-aa88-ffde6b01ae3f.png" 
              alt="Aire Labs Logo" 
              className="w-8 h-8 rounded-md"
            />
            <span className="text-xl font-bold text-gray-900">Aire Labs</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-bankable-100 text-bankable-700">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
