import React, { useEffect, useRef, useState } from "react";
import { Group, Message } from "@/types";
import GroupService from "@/services/GroupService";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import NoAccess from "@/components/groups/NoAccess";
import MessageService from "@/services/MessageService";

type Props = {
  groupId: number;
};

const GroupChat: React.FC<Props> = ({ groupId }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [noAccess, setNoAccess] = useState(false);
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
        setMessages(await response.json());
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
      alert("Message content cannot be empty.");
      return;
    }

    try {
      const response = await MessageService.sendMessage(groupId, newMessage);
      if (response.status === 401) {
        setIsUnauthorized(true);
      } else if (response.status === 400) {
        setNoAccess(true);
      } else if (response.ok) {
        const newMessageData = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessageData]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();
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

  if (!group) return <p>Loading group details...</p>;

  return (
    <div className="flex flex-col h-full bg-gray-50 shadow-lg rounded-lg">
      {/* Group Info */}
      <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg shadow-md">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="mt-2 text-sm">{group.description}</p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm font-medium">Code: {group.code}</span>
          <button
            className="bg-white text-indigo-600 px-3 py-1 rounded-md shadow hover:bg-indigo-100"
            onClick={() => navigator.clipboard.writeText(group.code)}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <p className="text-gray-800">{message.content}</p>
            {message.date && !isNaN(new Date(message.date).getTime()) ? (
              <span className="text-xs text-gray-500 block text-right">
                {new Date(message.date).toLocaleString()}
              </span>
            ) : (
              <span className="text-xs text-gray-500 block text-right">
                Invalid Date
              </span>
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Typing Field */}
      <div className="p-4 bg-gray-100 border-t flex items-center space-x-4 rounded-b-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
