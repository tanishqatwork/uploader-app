import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Database, Upload, BarChart3, Layers, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/Components/ui/Sidebar.jsx";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Upload Data",
    url: createPageUrl("Upload"),
    icon: Upload,
  },
  {
    title: "Data Explorer",
    url: createPageUrl("Explorer"),
    icon: Database,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <>
      <style>
        {`
          :root {
            --background: #fefefe;
            --foreground: #1e293b;
            --muted: #fafaf9;
            --muted-foreground: #64748b;
            --accent: #f1f5f9;
            --accent-foreground: #334155;
            --border: #e2e8f0;
            --primary: #3b82f6;
            --primary-foreground: #ffffff;
            --secondary: #10b981;
            --card: #ffffff;
            --popover: #ffffff;
          }
          
          .glass-effect {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .gradient-border {
            background: linear-gradient(145deg, #f8fafc, #ffffff);
            border: 1px solid rgba(148, 163, 184, 0.1);
          }
          
          .smooth-shadow {
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03), 0 8px 32px rgba(15, 23, 42, 0.04);
          }
          
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08), 0 12px 48px rgba(15, 23, 42, 0.06);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: 'var(--background)' }}>
        <Sidebar className="border-r border-slate-200/60 glass-effect">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center smooth-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-lg">DataFlow</h2>
                <p className="text-xs text-slate-500 font-medium">Intelligent Data Analysis</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 rounded-xl p-3 hover-lift ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-4 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Layers className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-600 font-medium">Datasets</p>
                      <p className="text-slate-900 font-semibold">0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-600 font-medium">Total Rows</p>
                      <p className="text-slate-900 font-semibold">0</p>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold text-slate-900">DataFlow</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-white">
            {children}
          </div>
        </main>
      </div>
    </>
  );
} 