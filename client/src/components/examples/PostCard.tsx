import { PostCard } from '../PostCard';
import salonImage from '@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png';

export default function PostCardExample() {
  return (
    <div className="max-w-2xl p-8">
      <PostCard
        id="1"
        businessName="Luxe Beauty Salon"
        timestamp="2 hours ago"
        content="New fall collection just arrived! Book your appointment now and get 20% off your first visit. We're excited to show y'all our latest styles! 💇‍♀️"
        image={salonImage}
        likes={24}
        comments={5}
      />
    </div>
  );
}
