import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChatMessage } from "@shared/schema";

export default function ChatPage() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => apiRequest("POST", "/api/chat/send", { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Could not send message",
        variant: "destructive",
      });
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMutation.mutate(message);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold font-[Poppins] text-foreground flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-primary" />
          AI Pediatric Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Get instant answers to your baby health questions
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="font-[Poppins] text-lg">
            Chat with AI Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about baby health, vaccines, feeding, sleep, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 px-4 md:px-6" ref={scrollRef}>
            <div className="space-y-4 py-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-3/4" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold font-[Poppins] text-foreground">
                      Start a Conversation
                    </h3>
                    <p className="text-muted-foreground mt-2 text-base">
                      Ask me anything about your baby's health and development
                    </p>
                  </div>
                  <div className="max-w-lg mx-auto space-y-3 text-sm">
                    <div className="bg-muted/50 rounded-lg p-3 text-left">
                      <p className="text-foreground">"What vaccines does my 3-month-old need?"</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-left">
                      <p className="text-foreground">"Is it normal for my baby to wake up at night?"</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-left">
                      <p className="text-foreground">"How much should a 6-month-old eat?"</p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div
                      className={`max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md border border-border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={`text-xs mt-2 ${msg.role === "user" ? "opacity-80" : "text-muted-foreground"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {sendMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-bl-md border border-border shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-background p-4">
            <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question here..."
                disabled={sendMutation.isPending}
                className="flex-1 h-11"
                data-testid="input-message"
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0"
                disabled={sendMutation.isPending || !message.trim()}
                data-testid="button-send"
              >
                {sendMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
