import React, { useEffect, useRef, useState } from "react";
import { Group, Message } from "@/types";
import GroupService from "@/services/GroupService";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import NoAccess from "@/components/groups/NoAccess";
import MessageService from "@/services/MessageService";
import ReportModal from "../reports/ReportModal";
import { useTranslation } from "next-i18next"; // Import the translation hook

type Props = {
  groupId: number;
};

const GroupChat: React.FC<Props> = ({ groupId }) => {
  const { t } = useTranslation(); // Hook to access translations
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [noAccess, setNoAccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );

  const [loggedInUser, setLoggedInUser] = useState<{ username: string } | null>(
    null
  );
  const messageEndRef = useRef<HTMLDivElement>(null);

  const fetchGroupDetails = async () => {
    try {
      const groupDetails = await GroupService.getGroupById(groupId);
      if (groupDetails.status === 401) {
        setIsUnauthorized(true);
      } else if (groupDetails.status === 400) {
        setNoAccess(true);
      } else if (groupDetails.ok) {
        setGroup(await groupDetails.json());
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await GroupService.getMessagesByGroupId(groupId);
      if (response.status === 401) {
        setIsUnauthorized(true);
      } else if (response.status === 400) {
        setNoAccess(true);
      } else if (response.ok) {
        const newMessages = await response.json();

        // Use functional state update to ensure the latest `messages` state
        setMessages((prevMessages) => {
          if (
            newMessages.length !== prevMessages.length ||
            !newMessages.every(
              (msg: Message, index: number) =>
                msg.id === prevMessages[index]?.id
            )
          ) {
            return newMessages;
          }
          return prevMessages;
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      alert(t("groupChat.emptyMessageError"));
      return;
    }
    if (isSending) return;
    setIsSending(true);
    try {
      const response = await MessageService.sendMessage(groupId, newMessage);
      if (response.status === 401) {
        setIsUnauthorized(true);
      } else if (response.status === 400) {
        setNoAccess(true);
      } else if (response.ok) {
        const newMessageData = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessageData,
            user: {
              id: loggedInUser?.username,
              username: loggedInUser?.username || "Unknown User",
            },
          },
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const openReportModal = (messageId: number) => {
    setSelectedMessageId(messageId);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedMessageId(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    fetchGroupDetails();
    fetchMessages();

    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isUnauthorized) {
    return <UnauthorizedAccess />;
  }

  if (noAccess) {
    return <NoAccess />;
  }

  if (!group) return <p>{t("groupChat.loadingGroupDetails")}</p>;

  return (
    <div className="flex flex-col h-full bg-gray-50 shadow-lg rounded-lg">
      {/* Group Info */}
      <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg shadow-md">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="mt-2 text-sm">{group.description}</p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm font-medium">
            {t("groupChat.code")}: {group.code}
          </span>
          <button
            className="bg-white text-indigo-600 px-3 py-1 rounded-md shadow hover:bg-indigo-100"
            onClick={() => navigator.clipboard.writeText(group.code)}
          >
            {t("groupChat.copy")}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.map((message) => {
          const isUserMessage =
            loggedInUser && message.user?.username === loggedInUser.username;

          return (
            <div
              key={message.id}
              className={`relative p-4 rounded-lg shadow-sm ${
                isUserMessage
                  ? "bg-indigo-100 text-indigo-900 self-end"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {/* Report button in the upper-right corner */}
              {!isUserMessage && (
                <button
                  onClick={() =>
                    message.id !== undefined && openReportModal(message.id)
                  }
                  className="absolute top-2 right-2 text-indigo-600 hover:text-indigo-800"
                >
                  {t("groupChat.report")}
                </button>
              )}

              <p className="text-sm font-semibold">
                {message.user?.username || t("groupChat.unknownUser")}
              </p>
              <p className="mt-1 break-words whitespace-pre-wrap">
                {message.content}
              </p>
              {message.date && !isNaN(new Date(message.date).getTime()) ? (
                <span className="text-xs text-gray-500 block text-right">
                  {new Date(message.date).toLocaleString()}
                </span>
              ) : (
                <span className="text-xs text-gray-500 block text-right">
                  {t("groupChat.invalidDate")}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Typing Field */}
      <div className="p-4 bg-gray-100 border-t flex items-center space-x-4 rounded-b-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t("groupChat.typeMessage")}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className={`${
            isSending ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-4 py-2 rounded-lg shadow`}
          disabled={isSending}
        >
          {isSending ? t("groupChat.sending") : t("groupChat.send")}
        </button>
      </div>
      {showReportModal && selectedMessageId && (
        <ReportModal messageId={selectedMessageId} onClose={closeReportModal} />
      )}
    </div>
  );
};

export default GroupChat;
