import { CategoryCard } from '../CategoryCard';
import { Heart } from 'lucide-react';

export default function CategoryCardExample() {
  return (
    <div className="max-w-sm p-8">
      <CategoryCard
        icon={Heart}
        title="Health"
        businessCount={150}
      />
    </div>
  );
}
