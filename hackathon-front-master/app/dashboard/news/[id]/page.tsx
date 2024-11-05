'use client'
import NewsDetail from '@/presentation/components/NewDetail';

const NewsPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;  
  return <NewsDetail id={id} />;
};

export default NewsPage;
