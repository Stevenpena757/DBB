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

    // Seed real DFW businesses from directory
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
        services: ["Laser Hair Removal", "Botox", "Dermal Fillers", "Chemical Peels"]
      },
      {
        name: "Advanced Skin Fitness Medical Spa",
        description: "Advanced medical spa specializing in laser treatments and CoolSculpting for body contouring",
        category: "Med Spa",
        location: "Dallas",
        address: "9201 N Central Expy, Ste 210, Dallas, TX 75231",
        phone: "(214) 521-5277",
        website: "https://advancedskinfitness.com/",
        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
        rating: 47,
        reviewCount: 124,
        services: ["Laser Hair Removal", "CoolSculpting", "Skin Rejuvenation", "Facials"]
      },
      {
        name: "North Dallas Dermatology Associates",
        description: "Cosmetic dermatology practice offering laser treatments and medical-grade skincare solutions",
        category: "Dermatology",
        location: "Dallas",
        address: "8144 Walnut Hill Ln, Suite 1300, Dallas, TX 75231",
        phone: "(214) 420-7070",
        website: "https://northdallasderm.com/",
        imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        rating: 49,
        reviewCount: 203,
        services: ["Laser Treatments", "Cosmetic Procedures", "Medical Dermatology", "Skin Cancer Screening"],
        featured: true
      },
      {
        name: "SkinSpirit – West Village",
        description: "Uptown med spa offering injectables, advanced skin treatments, and personalized aesthetic care",
        category: "Med Spa",
        location: "Dallas",
        address: "West Village, Dallas, TX",
        phone: "(469) 259-2800",
        website: "https://www.skinspirit.com/locations/west-village",
        imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
        rating: 48,
        reviewCount: 187,
        services: ["Injectables", "Laser Treatments", "Facials", "Body Contouring"]
      },
      {
        name: "Lemmon Avenue Plastic Surgery & Laser Center",
        description: "Medical aesthetics center combining plastic surgery expertise with advanced laser technology",
        category: "Med Spa",
        location: "Dallas",
        address: "2801 Lemmon Avenue W, Suite 300, Dallas, TX 75204",
        phone: "214-702-0707",
        website: "https://www.lemmonavenueplasticsurgery.com/",
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
        rating: 50,
        reviewCount: 241,
        services: ["Plastic Surgery", "Laser Treatments", "Injectables", "Skin Rejuvenation"],
        featured: true
      },
      {
        name: "Amazing Lash Studio – West Village",
        description: "Premier lash extension studio in Uptown Dallas offering custom lash designs",
        category: "Lash & Brow",
        location: "Dallas",
        address: "3699 McKinney Ave, Suite 502, Dallas, TX 75204",
        phone: "(469) 904-6290",
        website: "https://www.amazinglashstudio.com/",
        imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
        rating: 46,
        reviewCount: 98,
        services: ["Lash Extensions", "Volume Lashes", "Lash Lifts", "Lash Tinting"]
      },
      {
        name: "The Lash Lounge – Lakewood",
        description: "Lakewood's premier lash extension salon with expert lash artists and custom styling",
        category: "Lash & Brow",
        location: "Dallas",
        address: "6465 E Mockingbird Ln, #372, Dallas, TX 75214",
        phone: "214-239-0331",
        website: "https://www.thelashlounge.com/tx-dallas-lakewood/",
        imageUrl: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800",
        rating: 48,
        reviewCount: 156,
        services: ["Lash Extensions", "Brow Services", "Lash Fills", "Custom Styling"]
      },
      {
        name: "The Lash Lounge – Park Cities",
        description: "Park Cities lash boutique offering luxurious lash extensions and brow services",
        category: "Lash & Brow",
        location: "Dallas",
        address: "5560 W Lovers Ln, Ste 255, Dallas, TX 75209",
        phone: "214-432-1142",
        website: "https://www.thelashlounge.com/tx-dallas-park-cities/",
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
        rating: 47,
        reviewCount: 134,
        services: ["Lash Extensions", "Brow Lamination", "Lash Lifts", "Brow Tinting"]
      },
      {
        name: "Verbena Parlor + Social House",
        description: "Upscale nail salon and social lounge offering premium nail services in a chic atmosphere",
        category: "Nail Salon",
        location: "Dallas",
        address: "2626 Howell St, #166, Dallas, TX 75204",
        phone: "214-433-7359",
        website: "https://www.verbenaparlor.com/",
        imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
        rating: 49,
        reviewCount: 178,
        services: ["Manicures", "Pedicures", "Gel Nails", "Nail Art"],
        featured: true
      },
      {
        name: "Ideal Image – West Village",
        description: "National med spa chain offering laser hair removal, injectables, and skin treatments",
        category: "Med Spa",
        location: "Dallas",
        address: "3839 McKinney Ave, Suite 110, Dallas, TX 75204",
        phone: "469-784-9932",
        website: "https://www.idealimage.com/locations/texas/dallas-west-village",
        imageUrl: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800",
        rating: 45,
        reviewCount: 267,
        services: ["Laser Hair Removal", "Botox", "CoolSculpting", "IPL Treatments"]
      },
      {
        name: "Milan Laser Hair Removal – Addison",
        description: "Specialized laser hair removal clinic in Addison with guaranteed permanent results",
        category: "Laser Hair Removal",
        location: "Dallas",
        address: "5225 Belt Line Rd, Dallas, TX 75254",
        phone: "469-312-2993",
        website: "https://milanlaserdallas.com/locations/dallas/",
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
        rating: 48,
        reviewCount: 312,
        services: ["Laser Hair Removal", "Full Body Hair Removal", "Facial Hair Removal"]
      },
      {
        name: "Milan Laser Hair Removal – Northeast Dallas",
        description: "Northeast Dallas location offering unlimited laser hair removal packages",
        category: "Laser Hair Removal",
        location: "Dallas",
        address: "6464 E Northwest Hwy, Ste 345, Dallas, TX 75214",
        phone: "(469) 902-2916",
        website: "https://milanlaser.com/locations/tx/dallas/6464-e-nw-hwy",
        imageUrl: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=800",
        rating: 47,
        reviewCount: 289,
        services: ["Laser Hair Removal", "Permanent Hair Reduction", "All Skin Types"]
      },
      {
        name: "MINT dentistry – Uptown",
        description: "Modern cosmetic dentistry practice offering teeth whitening and smile enhancement",
        category: "Cosmetic Dentistry",
        location: "Dallas",
        address: "2520 Fairmount St, Suite 100, Dallas, TX 75201",
        phone: "469-440-7149",
        website: "https://mintdentistry.com/dentist/dfw/uptown",
        imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
        rating: 46,
        reviewCount: 201,
        services: ["Teeth Whitening", "Veneers", "Cosmetic Dentistry", "General Dentistry"]
      },
      {
        name: "BLEU Dentistry",
        description: "Contemporary dental practice specializing in enhanced whitening services and cosmetic procedures",
        category: "Cosmetic Dentistry",
        location: "Dallas",
        address: "Dallas, TX",
        phone: "(214) 699-4976",
        website: "https://www.bleudentist.com/",
        imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
        rating: 48,
        reviewCount: 167,
        services: ["Enhanced Whitening", "Cosmetic Dentistry", "Smile Makeovers", "Veneers"]
      },
      {
        name: "We Whiten – Preston Center",
        description: "Dedicated teeth whitening studio offering quick and effective professional whitening treatments",
        category: "Teeth Whitening",
        location: "Dallas",
        address: "7700 W Northwest Hwy, Dallas, TX 75225",
        phone: "(972) 649-0459",
        website: "https://www.wewhiten.com/",
        imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800",
        rating: 47,
        reviewCount: 143,
        services: ["Professional Whitening", "Express Whitening", "Custom Trays"]
      },
      {
        name: "Laced by Lonice Spa & Boutique",
        description: "Full-service beauty destination offering aesthetics, facials, lashes, and whitening services",
        category: "Med Spa",
        location: "Dallas",
        address: "2504 Kimsey Dr, Dallas, TX 75235",
        website: "https://www.lacedbylonice.com/",
        imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        rating: 49,
        reviewCount: 112,
        services: ["Facials", "Lash Extensions", "Teeth Whitening", "Aesthetic Services"]
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
