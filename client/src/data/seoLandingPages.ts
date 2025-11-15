export type LandingDef = {
  slug: string;
  title: string;
  city?: string;
  category?: string;
  variant?: string;
};

export const SEO_LANDING_PAGES: LandingDef[] = [
  { slug:"best-med-spas-dallas", title:"Best Med Spas in Dallas (2025 Ranked)", city:"Dallas", category:"Med Spa", variant:"ranked" },
  { slug:"best-med-spas-plano", title:"Best Med Spas in Plano (Top 10)", city:"Plano", category:"Med Spa" },
  { slug:"best-med-spas-frisco", title:"Best Med Spas in Frisco (Expert Picks)", city:"Frisco", category:"Med Spa" },
  { slug:"best-med-spas-fort-worth", title:"Best Med Spas in Fort Worth (Top Rated)", city:"Fort Worth", category:"Med Spa" },
  { slug:"best-med-spas-arlington", title:"Best Med Spas in Arlington (Where Locals Go)", city:"Arlington", category:"Med Spa" },
  { slug:"best-med-spas-irving", title:"Best Med Spas in Irving (Top Treatments)", city:"Irving", category:"Med Spa" },
  { slug:"best-med-spas-mckinney", title:"Best Med Spas in McKinney (Customer Favorites)", city:"McKinney", category:"Med Spa" },
  { slug:"best-med-spas-allen", title:"Best Med Spas in Allen (Most Reviewed)", city:"Allen", category:"Med Spa" },

  { slug:"best-botox-clinics-dallas", title:"Best Botox Clinics in Dallas (Top Providers)", city:"Dallas", category:"Botox" },
  { slug:"best-botox-clinics-plano", title:"Best Botox Clinics in Plano (Verified Reviews)", city:"Plano", category:"Botox" },
  { slug:"best-botox-clinics-frisco", title:"Best Botox Clinics in Frisco (Where to Get Botox Safely)", city:"Frisco", category:"Botox" },
  { slug:"best-botox-clinics-fort-worth", title:"Best Botox Clinics in Fort Worth (Top Aesthetic Injectors)", city:"Fort Worth", category:"Botox" },
  { slug:"best-lip-filler-specialists-dallas", title:"Best Lip Filler Specialists in Dallas (Beautiful Natural Results)", city:"Dallas", category:"Lip Filler" },
  { slug:"best-lip-filler-specialists-plano", title:"Best Lip Filler Specialists in Plano (Expert Injectors)", city:"Plano", category:"Lip Filler" },
  { slug:"best-lip-filler-specialists-frisco", title:"Best Lip Filler Specialists in Frisco (Top Ratings)", city:"Frisco", category:"Lip Filler" },

  { slug:"best-lash-extensions-dallas", title:"Best Lash Extensions in Dallas (Volume + Hybrid)", city:"Dallas", category:"Lashes" },
  { slug:"best-lash-extensions-plano", title:"Best Lash Extensions in Plano (Top Lash Techs)", city:"Plano", category:"Lashes" },
  { slug:"best-lash-extensions-frisco", title:"Best Lash Extensions in Frisco (Where to Get Stunning Lashes)", city:"Frisco", category:"Lashes" },
  { slug:"best-lash-extensions-arlington", title:"Best Lash Extensions in Arlington (Affordable + Skilled)", city:"Arlington", category:"Lashes" },
  { slug:"best-lash-lifts-dallas", title:"Best Lash Lifts in Dallas (Natural Look Experts)", city:"Dallas", category:"Lashes" },

  { slug:"best-facial-treatments-dallas", title:"Best Facial Treatments in Dallas (Hydrafacial, Peels & More)", city:"Dallas", category:"Facials" },
  { slug:"best-facial-treatments-plano", title:"Best Facial Treatments in Plano (Top Estheticians)", city:"Plano", category:"Facials" },
  { slug:"best-facial-treatments-frisco", title:"Best Facial Treatments in Frisco (Glowing Skin Guaranteed)", city:"Frisco", category:"Facials" },
  { slug:"best-microneedling-dallas", title:"Best Microneedling Clinics in Dallas (Skin Rejuvenation)", city:"Dallas", category:"Microneedling" },
  { slug:"best-chemical-peels-dallas", title:"Best Chemical Peel Clinics in Dallas (For All Skin Types)", city:"Dallas", category:"Chemical Peels" },
  { slug:"best-acne-facials-dallas", title:"Best Acne Facial Clinics in Dallas (Teen + Adult Treatments)", city:"Dallas", category:"Facials" },

  { slug:"best-laser-hair-removal-dallas", title:"Best Laser Hair Removal in Dallas (Safe & Effective)", city:"Dallas", category:"Laser Hair Removal" },
  { slug:"best-laser-hair-removal-plano", title:"Best Laser Hair Removal in Plano (Top Technology)", city:"Plano", category:"Laser Hair Removal" },
  { slug:"best-laser-hair-removal-frisco", title:"Best Laser Hair Removal in Frisco (Long-Lasting Results)", city:"Frisco", category:"Laser Hair Removal" },
  { slug:"best-brazilian-laser-dallas", title:"Best Brazilian Laser Hair Removal in Dallas (Comfort-Focused)", city:"Dallas", category:"Laser Hair Removal" },

  { slug:"best-nail-salons-dallas", title:"Best Nail Salons in Dallas (Top Trends)", city:"Dallas", category:"Nails" },
  { slug:"best-nail-salons-plano", title:"Best Nail Salons in Plano (Gel, Dip & Acrylic)", city:"Plano", category:"Nails" },
  { slug:"best-nail-salons-frisco", title:"Best Nail Salons in Frisco (Skill + Style)", city:"Frisco", category:"Nails" },
  { slug:"best-mani-pedi-dallas", title:"Best Mani-Pedi Spots in Dallas (Relax + Refresh)", city:"Dallas", category:"Nails" },
  { slug:"best-brow-lamination-dallas", title:"Best Brow Lamination in Dallas (Perfect Brows)", city:"Dallas", category:"Brows" },
  { slug:"best-brow-threading-dallas", title:"Best Brow Threading in Dallas (Precision Artists)", city:"Dallas", category:"Brows" },

  { slug:"best-teeth-whitening-dallas", title:"Best Teeth Whitening Services in Dallas (Instant Brightening)", city:"Dallas", category:"Teeth Whitening" },
  { slug:"best-cosmetic-dentists-dallas", title:"Best Cosmetic Dentists in Dallas (Smile Makeovers)", city:"Dallas", category:"Cosmetic Dentistry" },
  { slug:"best-veneers-dallas", title:"Best Veneers in Dallas (Top Cosmetic Dentists)", city:"Dallas", category:"Cosmetic Dentistry" },

  { slug:"top-beauty-aesthetics-dallas", title:"Top Beauty & Aesthetics Businesses in Dallas (Updated 2025)", city:"Dallas" },
  { slug:"best-aesthetic-clinics-dallas", title:"Best Aesthetic Clinics in Dallas (All Services)", city:"Dallas" },
  { slug:"best-wellness-beauty-centers-dallas", title:"Best Wellness & Beauty Centers in Dallas (Complete Care)", city:"Dallas" },
  { slug:"best-womens-beauty-services-dallas", title:"Best Women's Beauty Services in Dallas (Top Rated)", city:"Dallas" },
  { slug:"best-mens-grooming-aesthetics-dallas", title:"Best Men's Grooming & Aesthetics in Dallas (Modern Treatments)", city:"Dallas" },

  { slug:"best-non-surgical-lifts-dallas", title:"Best Non-Surgical Facial Lifts in Dallas (2025 Edition)", city:"Dallas" },
  { slug:"best-anti-aging-treatments-dallas", title:"Best Anti-Aging Treatments in Dallas (Expert Approved)", city:"Dallas" },
  { slug:"best-skin-tightening-dallas", title:"Best Skin Tightening Clinics in Dallas (Proven Results)", city:"Dallas" },
  { slug:"best-ethnic-skincare-dallas", title:"Best Ethnic Skincare Specialists in Dallas (Inclusive Aesthetics)", city:"Dallas" },
  { slug:"best-korean-skincare-facials-dallas", title:"Best Korean Skincare Facials in Dallas (Highly Requested)", city:"Dallas" },
  { slug:"best-iv-vitamin-therapy-dallas", title:"Best IV Vitamin Therapy in Dallas (Wellness Boost)", city:"Dallas" }
];
