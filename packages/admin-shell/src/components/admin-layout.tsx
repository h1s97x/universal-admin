/**
 * AdminLayout Component
 * 
 * Main layout shell for admin dashboards.
 * Provides sidebar navigation, header, and content area.
 */

import React, { ReactNode, useState, ComponentType, createContext, useContext } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Bell,
  User,
  Moon,
  Sun,
} from 'lucide-react';
import type { AdminShellConfig, MenuItem, UserInfo } from '../types';

// ============================================================================
// Theme System
// ============================================================================

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  defaultTheme?: Theme;
  children: ReactNode;
  onThemeChange?: (theme: Theme) => void;
}

export function ThemeProvider({ defaultTheme = 'system', children, onThemeChange }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    onThemeChange?.(newTheme);

    // Apply to document
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Get resolved theme
  const getResolvedTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const toggleTheme = () => {
    const resolved = getResolvedTheme();
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  };

  // Initialize theme on mount
  React.useEffect(() => {
    setTheme(defaultTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme: getResolvedTheme(),
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface SidebarProps {
  items: MenuItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  LinkComponent?: ComponentType<{ href: string; children: ReactNode; className?: string }>;
}

function Sidebar({ items, collapsed, mobileOpen, onClose, LinkComponent }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string>('');

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (item.disabled) return null;

    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    const content = (
      <div
        onClick={() => {
          if (!item.href && !hasChildren) return;
          setActiveItem(item.id);
          onClose();
        }}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg
          transition-colors duration-200
          ${level > 0 ? 'ml-6' : ''}
          ${isActive
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }
          ${collapsed && level === 0 ? 'justify-center' : ''}
          ${(item.href || hasChildren) ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        {item.icon && (
          <IconComponent name={item.icon} className="w-5 h-5 flex-shrink-0" />
        )}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                {item.badge}
              </span>
            )}
          </>
        )}
      </div>
    );

    const wrappedContent = item.href && LinkComponent ? (
      <LinkComponent href={item.href} className="block">
        {content}
      </LinkComponent>
    ) : item.href ? (
      <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="block">
        {content}
      </a>
    ) : (
      content
    );

    return (
      <div key={item.id}>
        {wrappedContent}
        
        {hasChildren && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          z-50 transition-all duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className={`
          flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!collapsed && <span className="font-semibold text-lg text-gray-900 dark:text-white">Admin</span>}
          <button
            onClick={onClose}
            className="p-1 rounded lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {items.map((item) => renderMenuItem(item))}
        </nav>
      </aside>
    </>
  );
}

interface HeaderProps {
  title?: string;
  user?: UserInfo | null;
  onMenuClick: () => void;
  onLogout?: () => void;
  actions?: ReactNode;
  showThemeToggle?: boolean;
}

function Header({ title, user, onMenuClick, onLogout, actions, showThemeToggle = false }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          {title && (
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {actions}
          
          {/* Theme Toggle */}
          {showThemeToggle && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          )}
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {user && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                {user.role && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                )}
              </div>
            </div>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  LinkComponent?: ComponentType<{ href: string; children: ReactNode; className?: string }>;
}

function Breadcrumb({ items, LinkComponent }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {item.href && LinkComponent ? (
            <LinkComponent href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400">
              {item.label}
            </LinkComponent>
          ) : item.href ? (
            <a href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 dark:text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// ============================================================================
// Icon Component
// ============================================================================

function IconComponent({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, string> = {
    'Home': '⌂',
    'Users': '👥',
    'Settings': '⚙',
    'FileText': '📄',
    'BarChart3': '📊',
    'Bell': '🔔',
    'Building2': '🏢',
    'Settings2': '⚙',
    'Plus': '+',
    'Edit': '✏',
    'Trash': '🗑',
    'Search': '🔍',
    'Filter': '⚡',
    'Download': '⬇',
    'Upload': '⬆',
  };
  
  return (
    <span className={className} title={name}>
      {iconMap[name] || '○'}
    </span>
  );
}

// ============================================================================
// Main AdminLayout Component
// ============================================================================

export interface AdminLayoutProps extends AdminShellConfig {
  children: ReactNode;
  /** Show collapse toggle */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Custom Link component (e.g., Next.js Link) */
  linkComponent?: ComponentType<{ href: string; children: ReactNode; className?: string }>;
  /** Show theme toggle button in header */
  showThemeToggle?: boolean;
  /** Default theme */
  defaultTheme?: Theme;
  /** Callback when theme changes */
  onThemeChange?: (theme: Theme) => void;
}

export function AdminLayout({
  title,
  menuItems,
  breadcrumbs,
  user,
  onLogout,
  headerActions,
  children,
  collapsible = true,
  defaultCollapsed = false,
  linkComponent,
  showThemeToggle = false,
  defaultTheme = 'system',
  onThemeChange,
}: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme={defaultTheme} onThemeChange={onThemeChange}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar */}
        <Sidebar
          items={menuItems}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          LinkComponent={linkComponent}
        />

        {/* Main content area */}
        <div className={`
          transition-all duration-300
          ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}>
          {/* Header */}
          <Header
            title={title}
            user={user}
            onMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            actions={headerActions}
            showThemeToggle={showThemeToggle}
          />

          {/* Page content */}
          <main className="p-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} LinkComponent={linkComponent} />
              </div>
            )}

            {children}
          </main>

          {/* Collapse toggle (desktop) */}
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex fixed bottom-6 right-6 w-10 h-10 items-center justify-center
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700
                transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

// ============================================================================
// Stat Card Component
// ============================================================================

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  gray: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

export function StatCard({
  title,
  value,
  description,
  icon,
  color = 'blue',
  trend,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-900 rounded-xl p-6
        border border-gray-200 dark:border-gray-800
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <IconComponent name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">vs last period</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Stat Card Grid
// ============================================================================

interface StatCardGridProps {
  stats: StatCardProps[];
  columns?: 1 | 2 | 3 | 4;
}

export function StatCardGrid({ stats, columns = 4 }: StatCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
