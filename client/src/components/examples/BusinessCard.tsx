import { BusinessCard } from '../BusinessCard';
import salonImage from '@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png';

export default function BusinessCardExample() {
  return (
    <div className="max-w-sm p-8">
      <BusinessCard
        id="1"
        name="Luxe Beauty Salon"
        category="Beauty"
        description="Upscale salon offering premium hair styling, coloring, and beauty treatments"
        image={salonImage}
        rating={4.8}
        reviewCount={127}
        location="Uptown Dallas"
        distance="2.3 mi"
        verified
      />
    </div>
  );
}
