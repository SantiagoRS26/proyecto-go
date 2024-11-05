'use client'
import { useState, useEffect } from 'react';
import axiosInstance from "@/infrastructure/api/axiosInstance";
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  link: string;
}

const NewsDetail = (params : {id:string}) => {
  const id = params.id;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      fetchNewsById(id);
    }
  }, [id]);

  const fetchNewsById = async (newsId: string) => {
    setLoading(true);
    try {      
      const response = await axiosInstance.get(`/news/${newsId}`);
      setNews(response.data.news);
      setError(null);
    } catch (err) {
      setError('Error fetching the news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      {news ? (
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-center">{news.title}</h1>
          <p className="text-gray-500 text-center mb-6 italic">{news.summary}</p>
          <div className="border-t border-gray-300 mt-4 mb-4"></div>
          <p className="text-lg text-gray-700 leading-relaxed">{news.content}</p>
          {news.link && (
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center mt-6"
            >
              Read more <FaExternalLinkAlt className="ml-2" />
            </a>
          )}
        </motion.div>
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
};

export default NewsDetail;
