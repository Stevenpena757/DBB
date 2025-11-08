import { SearchBar } from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Hero Variant</h3>
        <SearchBar variant="hero" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Header Variant</h3>
        <SearchBar variant="header" />
      </div>
    </div>
  );
}
