import React from 'react';

export const SidebarProvider = ({ children }) => <div>{children}</div>;
export const Sidebar = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarHeader = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarContent = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarGroup = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarGroupLabel = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarGroupContent = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarMenu = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarMenuItem = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarMenuButton = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarTrigger = ({ className }) => <button className={className}>Menu</button>; 