"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed bottom-0 left-0 right-0 z-50 flex h-16 bg-grey-900 text-white lg:sticky lg:top-0 lg:flex-col lg:h-screen transition-all duration-300",
      "h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] lg:h-screen lg:pb-0",
      isCollapsed ? "lg:w-20" : "lg:w-64",
      "md:h-20 md:px-6 lg:px-0",
      className
    )}>
      <div className={cn(
        "hidden p-8 lg:block transition-opacity duration-300",
        isCollapsed ? "lg:opacity-0 lg:pointer-events-none" : "lg:opacity-100"
      )}>
        <h1 className="text-2xl font-bold italic">finance</h1>
      </div>

      <nav id="sidebar-nav" className="flex flex-1 items-center justify-around px-4 lg:flex-col lg:items-stretch lg:justify-start lg:space-y-2 lg:px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center space-y-1 px-4 py-2 transition-colors lg:flex-row lg:space-x-3 lg:space-y-0 lg:rounded-lg lg:py-3",
                isActive 
                  ? 'bg-beige-100 text-grey-900 font-bold lg:bg-white' 
                  : 'text-grey-500 hover:text-white lg:hover:bg-grey-500/20',
                isCollapsed && "lg:justify-center lg:px-0"
              )}
            >
              {/* Icon placeholder (Dot) */}
              <div className={cn(
                "h-2 w-2 rounded-full bg-current lg:h-4 lg:w-4",
                !isActive && "opacity-40"
              )} />
              
              <span className={cn(
                "text-xs capitalize md:text-sm lg:text-base transition-all duration-300",
                isCollapsed ? "lg:hidden" : "lg:block"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="sidebar-nav"
        aria-label={isCollapsed ? 'Expand menu' : 'Minimize menu'}
        className="hidden lg:flex items-center space-x-3 p-8 text-grey-500 hover:text-white transition-colors"
      >
        <div className={cn(
          "h-4 w-4 border-2 border-current transition-transform duration-300",
          isCollapsed ? "rotate-180" : "rotate-0"
        )} />
        <span className={cn(
          "text-base font-bold transition-all duration-300",
          isCollapsed ? "lg:hidden" : "lg:block"
        )}>
          Minimize Menu
        </span>
      </button>
    </aside>
  );
}
