import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Chat } from "@/modules/ai/components/chat";

const AIPage = () => {
  return (
    <div>
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <Chat />
    </div>
  );
};

export default AIPage;
