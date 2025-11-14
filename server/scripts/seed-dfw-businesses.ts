import { storage } from "../storage";

const dfwBusinesses = [
  {
    name: "Enlighten MD",
    description: "Premier med spa offering laser treatments, injectables, and advanced aesthetic services in Dallas. Located in the Forest Lane medical district.",
    category: "Med Spa",
    location: "Dallas",
    address: "5232 Forest Lane, Suite 170, Dallas, TX 75244",
    phone: "214-964-0860",
    website: "https://www.enlightenmd.com/",
    email: "contact@enlightenmd.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Enlighten+MD",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Advanced Skin Fitness Medical Spa",
    description: "Advanced medical spa specializing in laser treatments and CoolSculpting for body contouring. Expert aesthetic solutions in North Dallas.",
    category: "Med Spa",
    location: "Dallas",
    address: "9201 N Central Expy, Ste 210, Dallas, TX 75231",
    phone: "(214) 521-5277",
    website: "https://advancedskinfitness.com/",
    email: "info@advancedskinfitness.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Advanced+Skin+Fitness",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "North Dallas Dermatology Associates",
    description: "Board-certified dermatologists providing cosmetic dermatology and advanced laser treatments. Trusted skin care experts in Dallas.",
    category: "Medical Aesthetics",
    location: "Dallas",
    address: "8144 Walnut Hill Ln, Suite 1300, Dallas, TX 75231",
    phone: "(214) 420-7070",
    website: "https://northdallasderm.com/",
    email: "info@northdallasderm.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "SkinSpirit – West Village",
    description: "Uptown Dallas med spa offering premium injectables, skincare treatments, and aesthetic services. Located in the vibrant West Village neighborhood.",
    category: "Med Spa",
    location: "Dallas",
    address: "West Village, Dallas, TX",
    phone: "(469) 259-2800",
    website: "https://www.skinspirit.com/locations/west-village",
    email: "westvillage@skinspirit.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: true,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Lemmon Avenue Plastic Surgery & Laser Center",
    description: "Comprehensive plastic surgery and medical aesthetics center offering laser treatments and surgical procedures. Expert care in Uptown Dallas.",
    category: "Medical Aesthetics",
    location: "Dallas",
    address: "2801 Lemmon Avenue W, Suite 300, Dallas, TX 75204",
    phone: "214-702-0707",
    website: "https://www.lemmonavenueplasticsurgery.com/",
    email: "info@lemmonavenueplasticsurgery.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Amazing Lash Studio – West Village",
    description: "Professional lash extension studio in Dallas West Village. Custom lash designs and expert application for stunning results.",
    category: "Lash & Brow",
    location: "Dallas",
    address: "3699 McKinney Ave, Suite 502, Dallas, TX 75204",
    phone: "(469) 904-6290",
    website: "https://www.amazinglashstudio.com/",
    email: "westvillage@amazinglashstudio.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "The Lash Lounge – Lakewood",
    description: "Premium lash and beauty services in Lakewood Dallas. Expert technicians providing custom lash extensions and brow shaping.",
    category: "Lash & Brow",
    location: "Dallas",
    address: "6465 E Mockingbird Ln, #372, Dallas, TX 75214",
    phone: "214-239-0331",
    website: "https://www.thelashlounge.com/tx-dallas-lakewood/",
    email: "lakewood@thelashlounge.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "The Lash Lounge – Park Cities",
    description: "Upscale lash studio in Park Cities offering premium lash extensions and beauty services. Conveniently located on West Lovers Lane.",
    category: "Lash & Brow",
    location: "Dallas",
    address: "5560 W Lovers Ln, Ste 255, Dallas, TX 75209",
    phone: "214-432-1142",
    website: "https://www.thelashlounge.com/tx-dallas-park-cities/",
    email: "parkcities@thelashlounge.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Verbena Parlor + Social House",
    description: "Boutique nail salon offering luxury manicures, pedicures, and nail art in a chic Dallas location. Social atmosphere with premium services.",
    category: "Nail Salon",
    location: "Dallas",
    address: "2626 Howell St, #166, Dallas, TX 75204",
    phone: "214-433-7359",
    website: "https://www.verbenaparlor.com/",
    email: "hello@verbenaparlor.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Ideal Image – West Village",
    description: "Leading med spa specializing in laser hair removal, injectables, and skin treatments. Trusted aesthetic services in Dallas West Village.",
    category: "Med Spa",
    location: "Dallas",
    address: "3839 McKinney Ave, Suite 110, Dallas, TX 75204",
    phone: "469-784-9932",
    website: "https://www.idealimage.com/locations/texas/dallas-west-village",
    email: "westvillage@idealimage.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: true,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Milan Laser Hair Removal – Addison",
    description: "Professional laser hair removal clinic in Addison. FDA-cleared technology with guaranteed results and unlimited treatments.",
    category: "Med Spa",
    location: "Dallas",
    address: "5225 Belt Line Rd, Dallas, TX 75254",
    phone: "469-312-2993",
    website: "https://milanlaserdallas.com/locations/dallas/",
    email: "addison@milanlaser.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Milan Laser Hair Removal – Northeast Dallas",
    description: "Expert laser hair removal services in Northeast Dallas. State-of-the-art technology with lifetime guarantee on treatments.",
    category: "Med Spa",
    location: "Dallas",
    address: "6464 E Northwest Hwy, Ste 345, Dallas, TX 75214",
    phone: "(469) 902-2916",
    website: "https://milanlaser.com/locations/tx/dallas/6464-e-nw-hwy",
    email: "nedallas@milanlaser.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "MINT dentistry – Uptown",
    description: "Modern cosmetic dentistry in Uptown Dallas offering teeth whitening, veneers, and smile makeovers. Luxury dental experience.",
    category: "Medical Aesthetics",
    location: "Dallas",
    address: "2520 Fairmount St, Suite 100, Dallas, TX 75201",
    phone: "469-440-7149",
    website: "https://mintdentistry.com/dentist/dfw/uptown",
    email: "uptown@mintdentistry.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "BLEU Dentistry",
    description: "Premium cosmetic dentistry offering professional teeth whitening and aesthetic dental services. Beautiful smiles in Dallas.",
    category: "Medical Aesthetics",
    location: "Dallas",
    address: "Dallas, TX",
    phone: "(214) 699-4976",
    website: "https://www.bleudentist.com/services/enhanced-whitening/",
    email: "info@bleudentist.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "We Whiten – Preston Center",
    description: "Dedicated teeth whitening studio in Preston Center. Fast, professional whitening treatments with immediate results.",
    category: "Medical Aesthetics",
    location: "Dallas",
    address: "7700 W Northwest Hwy, Dallas, TX 75225",
    phone: "(972) 649-0459",
    website: "https://www.wewhiten.com/",
    email: "preston@wewhiten.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  },
  {
    name: "Laced by Lonice Spa & Boutique",
    description: "Full-service spa offering facials, lash extensions, teeth whitening, and aesthetic treatments. Boutique beauty experience in Dallas.",
    category: "Med Spa",
    location: "Dallas",
    address: "2504 Kimsey Dr, Dallas, TX 75235",
    phone: "",
    website: "https://www.lacedbylonice.com/",
    email: "info@lacedbylonice.com",
    imageUrl: "https://placehold.co/800x600/4a3428/ffffff?text=Business",
    featured: false,
    verified: true,
    subscriptionTier: "free" as const
  }
];

async function seedDFWBusinesses() {
  console.log("🌱 Starting DFW business seed...");
  
  try {
    let successCount = 0;
    let skipCount = 0;

    for (const business of dfwBusinesses) {
      try {
        // Check if business already exists by name
        const allBusinesses = await storage.getAllBusinesses();
        const exists = allBusinesses.find((b: any) => b.name === business.name);
        
        if (exists) {
          console.log(`⏭️  Skipping "${business.name}" - already exists`);
          skipCount++;
          continue;
        }

        // Create the business
        const created = await storage.createBusiness(business);
        console.log(`✅ Added: ${created.name} (${created.category}) - ${created.location}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add ${business.name}:`, error);
      }
    }

    console.log(`\n🎉 Seed complete!`);
    console.log(`   ✅ Added: ${successCount} businesses`);
    console.log(`   ⏭️  Skipped: ${skipCount} businesses (already exist)`);
    console.log(`   📊 Total in CSV: ${dfwBusinesses.length}`);
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run the seed
seedDFWBusinesses()
  .then(() => {
    console.log("\n✨ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
