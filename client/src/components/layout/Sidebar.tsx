
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  AlertTriangle,
  Settings, 
  ChevronDown,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const AppSidebar = () => {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Issues']);

  const menuItems = [
    { title: t('nav.dashboard'), icon: LayoutDashboard, path: '/' },
    { 
      title: t('nav.issues'), 
      icon: FileText, 
      path: '/issues',
      hasSubmenu: true,
      submenu: [
        { title: t('nav.allIssues'), path: '/issues/all' },
        { title: t('nav.urgentIssues'), path: '/issues/urgent' }
      ]
    },
    { title: t('nav.settings'), icon: Settings, path: '/settings' }
  ];

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="bg-slate-800 border-slate-700">
      <SidebarHeader className="bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="bg-blue-600 rounded-lg p-2 flex-shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {state === "expanded" && (
            <span className="text-white font-semibold text-lg">AdminUI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.hasSubmenu ? (
                    <Collapsible
                      open={expandedMenus.includes(item.title)}
                      onOpenChange={() => toggleMenu(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon size={20} />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform ${
                              expandedMenus.includes(item.title) ? 'rotate-180' : ''
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={subItem.path}
                                  className={({ isActive }) => 
                                    `flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700 ${
                                      isActive ? 'text-blue-400 bg-slate-700' : ''
                                    }`
                                  }
                                >
                                  {subItem.title === t('nav.urgentIssues') && (
                                    <AlertTriangle size={16} className="text-red-500" />
                                  )}
                                  {subItem.title}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => 
                          `flex items-center gap-2 w-full text-slate-300 hover:text-white hover:bg-slate-700 ${
                            isActive ? 'text-blue-400 bg-slate-700' : ''
                          }`
                        }
                      >
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};