import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, BookOpen, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Target, label: 'Habits', path: '/habits' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: MessageCircle, label: 'Coach', path: '/coach' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-wellness z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center px-3 py-2 min-w-[60px] rounded-lg transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10 scale-105 shadow-wellness"
                    : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                )
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}