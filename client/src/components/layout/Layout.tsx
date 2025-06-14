// src/components/layout/Layout.tsx

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!isMobile && isSheetOpen) {
      setIsSheetOpen(false);
    }
  }, [isMobile, isSheetOpen]);

  return (
    <SidebarProvider>
      {/* Added w-full here to ensure the entire layout container takes full width */}
      <div className="min-h-screen bg-slate-900 flex w-full">
        {!isMobile && <AppSidebar />}
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger className="fixed top-4 left-4 z-50 text-white">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 bg-slate-900 border-r border-slate-700 p-0"
            >
              <AppSidebar />
            </SheetContent>
          </Sheet>
        )}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
