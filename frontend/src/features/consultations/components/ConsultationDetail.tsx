// src/features/consultations/components/consultation-detail.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import {
  Video,
  Send,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender: "patient" | "doctor";
  type: "text" | "video" | "image";
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Consultation {
  id: string;
  status: "pending" | "in_progress" | "completed";
  patient: {
    name: string;
    avatar?: string;
  };
  doctor?: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  messages: Message[];
}

interface ConsultationDetailProps {
  consultation: Consultation;
  userRole: "patient" | "doctor";
  onSendMessage: (content: string, type: "text" | "video") => void;
}

export function ConsultationDetail({
  consultation,
  userRole,
  onSendMessage,
}: ConsultationDetailProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const statusConfig = {
    pending: { label: t("pending"), icon: Clock, color: "bg-yellow-500" },
    in_progress: {
      label: t("inProgress"),
      icon: AlertCircle,
      color: "bg-blue-500",
    },
    completed: {
      label: t("completed"),
      icon: CheckCircle2,
      color: "bg-green-500",
    },
  };

  const currentStatus = statusConfig[consultation.status];
  const StatusIcon = currentStatus.icon;

  const handleSendText = () => {
    if (message.trim()) {
      onSendMessage(message, "text");
      setMessage("");
    }
  };

  const handleRecordVideo = () => {
    // In production, integrate with Loom SDK or similar
    // For now, this is a placeholder
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      onSendMessage("video-url-placeholder", "video");
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={
                    userRole === "patient"
                      ? consultation.doctor?.avatar
                      : consultation.patient.avatar
                  }
                />
                <AvatarFallback>
                  {userRole === "patient"
                    ? consultation.doctor?.name[0]
                    : consultation.patient.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {userRole === "patient"
                    ? consultation.doctor?.name || t("awaitingDoctor")
                    : consultation.patient.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("consultationStarted")}{" "}
                  {format(consultation.createdAt, "PPp")}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${currentStatus.color}`} />
              {currentStatus.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card>
        <CardContent className="p-0">
          <div
            className="h-[500px] overflow-y-auto p-4 space-y-4 scrollbar-thin"
            role="log"
            aria-label={t("consultationMessages")}
          >
            {consultation.messages.map((msg) => {
              const isOwn = msg.sender === userRole;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.type === "video" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {t("videoMessage")}
                          </span>
                        </div>
                        <video
                          src={msg.content}
                          controls
                          className="w-full rounded"
                          aria-label={t("videoMessageFrom", {
                            sender: msg.sender,
                          })}
                        />
                      </div>
                    ) : msg.type === "image" ? (
                      <img
                        src={msg.content}
                        alt={t("sharedImage")}
                        className="rounded max-h-64"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {format(msg.timestamp, "p")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Input Area */}
      {consultation.status !== "completed" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("typeYourMessage")}
                rows={3}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
                aria-label={t("messageInput")}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSendText}
                  disabled={!message.trim()}
                  aria-label={t("sendMessage")}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRecordVideo}
                  disabled={isRecording}
                  aria-label={t("recordVideoMessage")}
                >
                  <Video
                    className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`}
                  />
                </Button>
                <Button variant="outline" aria-label={t("attachFile")}>
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isRecording && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                {t("recording")}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
