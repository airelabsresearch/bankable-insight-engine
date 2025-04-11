
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, FileSpreadsheet, Boxes, GitBranch, ShieldCheck, FileText, Users, Home } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();

  const links = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: Boxes },
    { name: 'Model Upload', path: '/upload', icon: FileSpreadsheet },
    { name: 'Scenarios', path: '/scenarios', icon: GitBranch },
    { name: 'Risk Analysis', path: '/risk', icon: ShieldCheck },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Team', path: '/team', icon: Users },
  ];

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar w-64 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        "border-r border-gray-200 bg-sidebar"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              onClick={closeSidebarIfMobile}
            >
              <link.icon className="mr-3 h-5 w-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70">Bankable v1.0</p>
            <p className="text-xs text-sidebar-foreground/50">© 2025 Bankable</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
