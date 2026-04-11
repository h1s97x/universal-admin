/**
 * @h1s97x/admin-shell
 * 
 * Admin dashboard layout shell with sidebar navigation, header, and common layout components.
 */

// Types
export type {
  MenuItem,
  BreadcrumbItem,
  StatCardData,
  UserInfo,
  AdminShellConfig,
  AdminLayoutSlot,
} from './types';

export type {
  AdminLayoutProps,
  StatCardProps,
} from './components/admin-layout';

// Components
export {
  AdminLayout,
  StatCard,
  StatCardGrid,
  ThemeProvider,
  useTheme,
} from './components/admin-layout';
