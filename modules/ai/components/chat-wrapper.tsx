import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Chat } from "./chat";
import { ChatSidebar } from "./chat-sidebar";

export const ChatWrapper = () => {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        <Chat />
      </SidebarInset>
    </SidebarProvider>
  );
};
