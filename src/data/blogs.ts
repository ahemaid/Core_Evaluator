export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

export const blogs: BlogPost[] = [
  {
    id: '1',
    title: 'How to Choose the Right Doctor for Your Needs',
    content: 'Choosing the right doctor is crucial for your health. In this article, we discuss the key factors to consider, including credentials, reviews, and communication style...',
    author: 'Admin',
    date: '2024-07-01',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'The Importance of Regular Health Checkups',
    content: 'Regular health checkups can help detect problems early and improve your chances for treatment and cure. Learn why you should never skip your annual checkup...',
    author: 'Dr. Mona Khaled',
    date: '2024-07-03',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Understanding Medical Ratings and Reviews',
    content: "Medical ratings and reviews can be a helpful tool when selecting a provider. Here's how to interpret them and what to look for...",
    author: 'Admin',
    date: '2024-07-05',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  },
]; 