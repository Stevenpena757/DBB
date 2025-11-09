import { db } from "./db";
import { users, businesses, articles, howTos, vendors, vendorProducts } from "@shared/schema";

export default async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Check if data already exists
    const existingBusinesses = await db.select().from(businesses);
    if (existingBusinesses.length > 0) {
      console.log("✅ Database already seeded, skipping...");
      return;
    }

    // Seed sample user (for testing)
    const [sampleUser] = await db.insert(users).values({
      replitId: "sample-user-123",
      username: "DallasBeauty",
      email: "contact@dallasbeauty.com",
      role: "business_owner"
    }).returning();

    // Seed real DFW businesses
    const businessesData = [
      {
        name: "Enlighten MD",
        description: "Premier med spa offering laser treatments, injectables, and advanced aesthetic procedures in North Dallas",
        category: "Med Spa",
        location: "Dallas",
        address: "5232 Forest Lane, Suite 170, Dallas, TX 75244",
        phone: "214-964-0860",
        website: "https://www.enlightenmd.com/",
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        isClaimed: true,
        claimedBy: sampleUser.id,
        featured: true,
        rating: 48,
        reviewCount: 156,
        services: ["Laser Hair Removal", "Botox", "Dermal Fillers", "Chemical Peels"],
        additionalImages: [
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
          "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800"
        ]
      },
      {
        name: "Reflections Med Spa",
        description: "Full-service medical spa specializing in non-invasive aesthetic treatments and anti-aging solutions",
        category: "Med Spa",
        location: "Dallas",
        address: "Dallas, TX",
        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
        rating: 46,
        reviewCount: 89,
        services: ["CoolSculpting", "Laser Treatments", "Injectables", "Facials"],
        additionalImages: [
          "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800"
        ]
      },
      {
        name: "Salon Pari",
        description: "High-end hair salon in Plano offering precision cuts, balayage, and luxury hair treatments",
        category: "Hair Salon",
        location: "Plano",
        address: "Plano, TX",
        imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
        rating: 50,
        reviewCount: 234,
        services: ["Hair Color", "Balayage", "Hair Extensions", "Keratin Treatments"],
        featured: true
      },
      {
        name: "True Beauty Bar",
        description: "Modern beauty lounge offering lash extensions, brow services, and makeup artistry in Fort Worth",
        category: "Lash & Brow",
        location: "Fort Worth",
        address: "Fort Worth, TX",
        imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
        rating: 47,
        reviewCount: 112,
        services: ["Lash Extensions", "Microblading", "Brow Lamination", "Makeup Services"]
      },
      {
        name: "Bloom Wellness Spa",
        description: "Holistic wellness spa combining massage therapy, facials, and body treatments in a serene atmosphere",
        category: "Wellness Spa",
        location: "Frisco",
        address: "Frisco, TX",
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
        rating: 49,
        reviewCount: 178,
        services: ["Massage Therapy", "Facials", "Body Wraps", "Aromatherapy"]
      }
    ];

    await db.insert(businesses).values(businessesData);

    // Seed sample articles
    const articlesData = [
      {
        businessId: 1,
        userId: sampleUser.id,
        title: "Winter Hair Care: Combat DFW's Dry Weather",
        content: "Winter in DFW brings dry air that can wreak havoc on your hair. Here are expert tips to keep your locks healthy...",
        excerpt: "Expert tips for maintaining healthy, hydrated hair during DFW's dry winter months",
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        category: "Hair Salon",
        views: 342
      },
      {
        businessId: 1,
        userId: sampleUser.id,
        title: "Injectable Trends 2024: What's Popular in DFW",
        content: "The aesthetic industry is constantly evolving. Here are the latest injectable trends we're seeing in Dallas-Fort Worth...",
        excerpt: "Discover the latest injectable trends dominating the DFW aesthetic scene",
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
        category: "Med Spa",
        views: 567
      }
    ];

    await db.insert(articles).values(articlesData);

    // Seed sample how-tos
    const howTosData = [
      {
        businessId: 1,
        userId: sampleUser.id,
        title: "How to Prepare for Your First Botox Appointment",
        description: "A comprehensive guide to preparing for your first cosmetic injectable treatment",
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        category: "Med Spa",
        steps: [
          { step: 1, title: "Consultation", content: "Schedule a consultation to discuss your goals" },
          { step: 2, title: "Avoid Blood Thinners", content: "Stop taking aspirin, ibuprofen 24-48 hours before" },
          { step: 3, title: "Clean Skin", content: "Arrive with a clean, makeup-free face" },
          { step: 4, title: "Ask Questions", content: "Don't hesitate to ask your provider any questions" }
        ]
      }
    ];

    await db.insert(howTos).values(howTosData);

    // Seed sample vendors
    const vendorsData = [
      {
        name: "Allure Beauty Supply",
        description: "Professional beauty supply distributor serving DFW salons and spas",
        category: "Beauty Products",
        imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
        website: "https://example.com",
        phone: "214-555-0100",
        email: "info@allurebeauty.com",
        featured: true
      },
      {
        name: "MedAesthetic Equipment Co.",
        description: "State-of-the-art aesthetic equipment and laser technology for medical spas",
        category: "Equipment",
        imageUrl: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=800",
        website: "https://example.com",
        phone: "214-555-0200",
        email: "sales@medaesthetic.com"
      }
    ];

    await db.insert(vendors).values(vendorsData);

    // Seed vendor products
    const productsData = [
      {
        vendorId: 1,
        name: "Professional Hair Color Line",
        description: "Premium ammonia-free hair color with 100+ shades",
        price: "$45.99/tube",
        category: "Hair Products",
        imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
      },
      {
        vendorId: 2,
        name: "IPL Laser System",
        description: "Advanced IPL technology for hair removal and skin rejuvenation",
        price: "$45,000",
        category: "Equipment",
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800"
      }
    ];

    await db.insert(vendorProducts).values(productsData);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seed };

// Run if called directly (ES module way)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seed()
    .then(() => {
      console.log("Seed complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
