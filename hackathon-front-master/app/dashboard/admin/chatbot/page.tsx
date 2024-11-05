'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axiosInstance from '@/infrastructure/api/axiosInstance';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { RootState } from '@/infrastructure/store';

const MAX_QUESTION_LENGTH = 3000;
const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (input.length > MAX_QUESTION_LENGTH) {
      setErrorMessage(`La pregunta es demasiado larga. El máximo permitido es de ${MAX_QUESTION_LENGTH} caracteres.`);
      return;
    }

    setErrorMessage('');

    const newMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/chatbot-admin`, { helperRequest: input, userid: userId });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: response.data.message },
      ]);
    } catch (error) {
      console.error('Error fetching chatbot response', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg px-4 md:px-20 transition-all duration-300">
      {/* Contenedor de mensajes ajustado */}
      <div className="flex-grow p-4 overflow-y-auto w-full h-5/6">
        {messages.map((message, index) => (
          <div key={index} className={`my-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-6 py-3 rounded-3xl max-w-full md:max-w-xl shadow-md ${message.role === 'user' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              {message.role === 'bot' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="my-2 flex justify-start">
            <div className="px-6 py-3 rounded-3xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md animate-pulse">
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input y botón de envío no scrolleables */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t rounded-2xl border-gray-300 dark:border-gray-700 w-full">
        <div className="flex items-center w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
          />
          <button
            onClick={sendMessage}
            className="ml-4 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            <FaPaperPlane className="h-5 w-5" />
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
