"use client";

import { Button } from "@/components/ui/button";
import { cn, copyToClipboard } from "@/lib/utils";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/modules/ai/components/chat-container";
import { DotsLoader } from "@/modules/ai/components/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/modules/ai/components/message";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/modules/ai/components/prompt-input";
import {
  Source,
  SourceContent,
  SourceTrigger,
} from "@/modules/ai/components/source";
import { Tool, type ToolPart } from "@/modules/ai/components/tool";
import { useChat } from "@ai-sdk/react";
import type { UIMessage, UIMessagePart } from "ai";
import { DefaultChatTransport } from "ai";
import {
  AlertTriangle,
  ArrowUp,
  Copy,
  Globe,
  Mic,
  PaperclipIcon,
} from "lucide-react";
import { memo, useState } from "react";
import { JuniorIcon } from "../icons";
import { ScrollButton } from "./scroll-button";

type MessageComponentProps = {
  message: UIMessage;
  isLastMessage: boolean;
};

const renderToolPart = (
  part: UIMessagePart<any, any>,
  index: number
): React.ReactNode => {
  if (!part.type?.startsWith("tool-")) return null;

  return <Tool key={`${part.type}-${index}`} toolPart={part as ToolPart} />;
};

// Sources wrapper component
const Sources = memo(({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 flex flex-wrap gap-1">{children}</div>
));

Sources.displayName = "Sources";

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message?.role === "assistant";

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0 space-y-2">
            <div className="w-full">
              {message?.parts
                .filter(
                  (part: any) => part.type && part.type.startsWith("tool-")
                )
                .map((part: any, index: number) => renderToolPart(part, index))}
            </div>

            {/* Render sources if they exist */}
            {message?.parts?.some(
              (part: any) => part.type === "source-url"
            ) && (
              <Sources>
                {message.parts
                  .filter((part: any) => part.type === "source-url")
                  .map((part: any, index: number) => (
                    <Source
                      key={`${message.id}-source-${index}`}
                      href={part.url}
                    >
                      <SourceTrigger
                        label={`${index + 1}`}
                        showFavicon={true}
                      />
                      <SourceContent
                        title={part.title || part.url}
                        description={part.description || ""}
                      />
                    </Source>
                  ))}
              </Sources>
            )}

            <MessageContent
              className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0"
              markdown
            >
              {message?.parts
                .filter((part: any) => part.type === "text")
                .map((part: any) => part.text)
                .join("")}
            </MessageContent>

            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() =>
                    copyToClipboard(
                      message.parts.map((part: any) => part.text).join("")
                    )
                  }
                >
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
              {message?.parts
                .map((part: any) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() =>
                    copyToClipboard(
                      message.parts.map((part: any) => part.text).join("")
                    )
                  }
                >
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    );
  }
);

MessageComponent.displayName = "MessageComponent";

const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-2 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0">
        <DotsLoader />
      </div>
    </div>
  </Message>
));

LoadingMessage.displayName = "LoadingMessage";

const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  </Message>
));

ErrorMessage.displayName = "ErrorMessage";

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [webSearch, setWebSearch] = useState(false);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const body = JSON.parse(init?.body as string);
        const updatedBody = {
          ...body,
          webSearch,
        };
        return fetch(input, {
          ...init,
          body: JSON.stringify(updatedBody),
        });
      },
    }),
  });

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    sendMessage({ text: prompt });
    setPrompt("");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">
        <ChatContainerContent className="space-y-12 px-4 py-12">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <JuniorIcon className="size-8 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">
                I&apos;m Junior. How can I help you today?
              </p>
            </div>
          )}
          {messages?.map((message, index) => {
            const isLastMessage = index === messages.length - 1;

            return (
              <MessageComponent
                key={message.id}
                message={message}
                isLastMessage={isLastMessage}
              />
            );
          })}

          {status === "submitted" && <LoadingMessage />}
          {status === "error" && error && <ErrorMessage error={error} />}
        </ChatContainerContent>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex justify-center">
          <ScrollButton className="shadow-sm" variant={"default"} />
        </div>
      </ChatContainerRoot>

      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <PromptInput
          isLoading={status !== "ready"}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Upload a file">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <PaperclipIcon size={18} />
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="Search Mode">
                  <Button
                    variant={webSearch ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setWebSearch(!webSearch)}
                  >
                    <Globe size={18} />
                    Search
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Voice input">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <Mic size={18} />
                  </Button>
                </PromptInputAction>

                <Button
                  size="icon"
                  disabled={!prompt.trim() || status !== "ready"}
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {status === "ready" || status === "error" ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
};
