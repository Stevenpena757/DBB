import { VendorCard } from '../VendorCard';

export default function VendorCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <VendorCard
        id="1"
        name="Beauty Supply Pro"
        category="Professional Products"
        description="Premium salon and spa supplies, equipment, and furniture for beauty professionals"
        rating={4.9}
        reviewCount={156}
        productTypes={["Hair Products", "Equipment", "Furniture", "Tools"]}
        verified={true}
      />
    </div>
  );
}
