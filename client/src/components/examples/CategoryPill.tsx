import { CategoryPill } from '../CategoryPill';
import { useState } from 'react';

export default function CategoryPillExample() {
  const [active, setActive] = useState("Health");
  const categories = ["Health", "Beauty", "Aesthetics", "Wellness"];

  return (
    <div className="flex flex-wrap gap-2 p-8">
      {categories.map((cat) => (
        <CategoryPill
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => setActive(cat)}
        />
      ))}
    </div>
  );
}
