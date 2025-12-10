import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Lightbulb, ClipboardList, Settings, Menu, X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Ideas', path: '/ideas', icon: Lightbulb },
    { name: 'Decisions', path: '/decisions', icon: ClipboardList },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="h-full flex flex-col">
          {/* Workspace Header */}
          <div className="h-16 flex items-center px-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center mr-3 font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)', color: 'var(--bg-primary)' }}>
              C
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>Cryo</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>Beta</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <div className="px-3 pt-4 pb-2">
            <NavLink
              to="/ideas?new=true"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)', color: 'var(--bg-primary)' }}>
              <Lightbulb className="w-4 h-4" />
              New Idea
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
                  style={{
                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid rgba(34, 211, 238, 0.2)' : '1px solid transparent'
                  }}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 transition-colors"
                    style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center p-2 rounded-lg transition-colors cursor-pointer"
              style={{ background: 'var(--bg-tertiary)' }}>
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--accent) 100%)', color: 'var(--bg-primary)' }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{currentUser?.name || 'User'}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{currentUser?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        {/* Mobile Header */}
        <div className="lg:hidden h-14 flex items-center px-4 justify-between" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="ml-2 font-bold" style={{ color: 'var(--text-primary)' }}>Cryo</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-6 lg:p-8" style={{ background: 'var(--bg-primary)' }}>
          <div className="h-full max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;