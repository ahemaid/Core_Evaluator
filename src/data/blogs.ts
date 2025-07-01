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
    title: 'كيف تختار الطبيب المناسب لاحتياجاتك',
    content: 'اختيار الطبيب المناسب أمر بالغ الأهمية لصحتك. في هذا المقال، نناقش العوامل الرئيسية التي يجب مراعاتها، بما في ذلك المؤهلات، والتقييمات، وأسلوب التواصل...',
    author: 'الإدارة',
    date: '2024-07-01',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'أهمية الفحوصات الصحية الدورية',
    content: 'الفحوصات الصحية الدورية تساعد في اكتشاف المشاكل مبكرًا وتحسين فرص العلاج والشفاء. تعرف على أهمية عدم إهمال الفحص السنوي...',
    author: 'د. منى خالد',
    date: '2024-07-03',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'فهم تقييمات ومراجعات الأطباء',
    content: 'تقييمات ومراجعات الأطباء أداة مفيدة عند اختيار مقدم الخدمة. تعرف كيف تفسرها وما الذي يجب البحث عنه...',
    author: 'الإدارة',
    date: '2024-07-05',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  },
]; 