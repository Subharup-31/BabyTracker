import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageCircle, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "Listening...",
        description: "Speak now to input your message",
      });
    }
  };

  const speakMessage = (text: string, messageId: string) => {
    // Stop any ongoing speech
    if (isSpeaking && speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    // If speaking a different message, stop it first
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // Clean up markdown formatting before speaking
    const cleanText = text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to just text
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/^\s*[-*+]\s/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s/gm, ''); // Remove numbered lists
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    speechSynthesisRef.current = utterance;

    // Select a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    
    // Prefer Google or Microsoft natural voices, then any English voice
    const preferredVoice = voices.find(voice => 
      (voice.name.includes('Google') || voice.name.includes('Microsoft')) && 
      voice.lang.startsWith('en')
    ) || voices.find(voice => 
      voice.lang.startsWith('en') && voice.localService === false
    ) || voices.find(voice => 
      voice.lang.startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Configure voice settings for more natural speech
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 0.85; // Lower pitch for deeper, more soothing voice
    utterance.volume = 1.0; // Full volume

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utterance.onerror = (event) => {
      // Don't show error if it was manually cancelled
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        toast({
          title: "Error",
          description: "Could not read the message aloud.",
          variant: "destructive",
        });
      }
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Load voices on mount
  useEffect(() => {
    // Load voices (some browsers need this)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      
      // Some browsers fire this event when voices are loaded
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

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
                      <div className="flex items-start gap-2">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words flex-1">{msg.content}</p>
                        {msg.role === "assistant" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0"
                            onClick={() => speakMessage(msg.content, msg.id)}
                            title={speakingMessageId === msg.id ? "Stop reading" : "Read aloud"}
                          >
                            {speakingMessageId === msg.id ? (
                              <VolumeX className="w-4 h-4 text-primary animate-pulse" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
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
                placeholder="Type or speak your question..."
                disabled={sendMutation.isPending || isListening}
                className="flex-1 h-11"
                data-testid="input-message"
              />
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className="h-11 w-11 shrink-0"
                onClick={toggleVoiceInput}
                disabled={sendMutation.isPending}
                data-testid="button-voice"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
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
