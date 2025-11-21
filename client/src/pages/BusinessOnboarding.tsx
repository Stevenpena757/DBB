import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DbbCard, DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Phone, Globe, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface BusinessFormData {
  businessName: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  ownerName: string;
  ownerTitle: string;
}

export default function BusinessOnboarding() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    category: "",
    address: "",
    city: "",
    state: "TX",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    ownerName: "",
    ownerTitle: "",
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const savedData = localStorage.getItem('businessOnboardingData');
      if (savedData) {
        navigate('/business-onboarding-submit');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const updateField = (field: keyof BusinessFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.businessName || !formData.category) {
        toast({
          title: "Required Fields",
          description: "Please fill in business name and category",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.address || !formData.city || !formData.zipCode || !formData.phone) {
        toast({
          title: "Required Fields",
          description: "Please fill in all location and contact information",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 3) {
      if (!formData.ownerName || !formData.ownerTitle) {
        toast({
          title: "Required Fields",
          description: "Please provide your name and title",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    localStorage.setItem('businessOnboardingData', JSON.stringify(formData));
    localStorage.setItem('postAuthRedirect', '/business-onboarding-submit');
    
    if (!isAuthenticated) {
      window.location.href = '/api/login';
    } else {
      navigate('/business-onboarding-submit');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <DbbContainer className="py-12 md:py-20 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl md:text-4xl mb-3 text-dbb-charcoal"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Join Dallas Beauty Book
          </h1>
          <p 
            className="text-lg text-dbb-charcoalSoft"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tell us about your business to get started
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= num
                      ? 'bg-dbb-forestGreen text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  data-testid={`step-indicator-${num}`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      step > num ? 'bg-dbb-forestGreen' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <DbbCard className="p-8">
          {step === 1 && (
            <div className="space-y-6" data-testid="step-business-basics">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-full bg-dbb-cream mb-4">
                  <Building2 className="h-8 w-8 text-dbb-forestGreen" />
                </div>
                <h2 
                  className="text-2xl font-semibold text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Business Basics
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    placeholder="Enter your business name"
                    data-testid="input-business-name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField('category', value)}
                  >
                    <SelectTrigger id="category" data-testid="select-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hair Salon">Hair Salon</SelectItem>
                      <SelectItem value="Nail Salon">Nail Salon</SelectItem>
                      <SelectItem value="Spa">Spa</SelectItem>
                      <SelectItem value="Medical Spa">Medical Spa</SelectItem>
                      <SelectItem value="Aesthetics">Aesthetics</SelectItem>
                      <SelectItem value="Barbershop">Barbershop</SelectItem>
                      <SelectItem value="Massage">Massage</SelectItem>
                      <SelectItem value="Makeup">Makeup</SelectItem>
                      <SelectItem value="Skincare">Skincare</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Tell us about your business and what makes it special"
                    rows={4}
                    data-testid="input-description"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  className="rounded-full px-8"
                  style={{
                    backgroundColor: 'hsl(158, 25%, 30%)',
                    color: 'white'
                  }}
                  data-testid="button-next-step1"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6" data-testid="step-location-contact">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-full bg-dbb-cream mb-4">
                  <MapPin className="h-8 w-8 text-dbb-forestGreen" />
                </div>
                <h2 
                  className="text-2xl font-semibold text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Location & Contact
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="1234 Main Street"
                    data-testid="input-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Dallas"
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      placeholder="75201"
                      data-testid="input-zip"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(214) 555-0100"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="hello@yourbusiness.com"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://yourbusiness.com"
                    data-testid="input-website"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="ghost"
                  data-testid="button-back-step2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="rounded-full px-8"
                  style={{
                    backgroundColor: 'hsl(158, 25%, 30%)',
                    color: 'white'
                  }}
                  data-testid="button-next-step2"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6" data-testid="step-owner-info">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-full bg-dbb-cream mb-4">
                  <CheckCircle className="h-8 w-8 text-dbb-forestGreen" />
                </div>
                <h2 
                  className="text-2xl font-semibold text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Your Information
                </h2>
                <p className="text-sm text-dbb-charcoalSoft mt-2">
                  This helps us verify ownership of the business
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerName">Your Full Name *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    placeholder="John Smith"
                    data-testid="input-owner-name"
                  />
                </div>

                <div>
                  <Label htmlFor="ownerTitle">Your Title/Role *</Label>
                  <Input
                    id="ownerTitle"
                    value={formData.ownerTitle}
                    onChange={(e) => updateField('ownerTitle', e.target.value)}
                    placeholder="Owner, Manager, etc."
                    data-testid="input-owner-title"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="ghost"
                  data-testid="button-back-step3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="rounded-full px-8"
                  style={{
                    backgroundColor: 'hsl(158, 25%, 30%)',
                    color: 'white'
                  }}
                  data-testid="button-next-step3"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6" data-testid="step-review">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-full bg-dbb-cream mb-4">
                  <CheckCircle className="h-8 w-8 text-dbb-forestGreen" />
                </div>
                <h2 
                  className="text-2xl font-semibold text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Review & Submit
                </h2>
              </div>

              <div className="space-y-4 bg-dbb-cream p-6 rounded-lg">
                <div>
                  <p className="text-sm text-dbb-charcoalSoft">Business Name</p>
                  <p className="font-semibold text-dbb-charcoal">{formData.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-dbb-charcoalSoft">Category</p>
                  <p className="font-semibold text-dbb-charcoal">{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm text-dbb-charcoalSoft">Location</p>
                  <p className="font-semibold text-dbb-charcoal">
                    {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dbb-charcoalSoft">Contact</p>
                  <p className="font-semibold text-dbb-charcoal">
                    {formData.phone} • {formData.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dbb-charcoalSoft">Owner</p>
                  <p className="font-semibold text-dbb-charcoal">
                    {formData.ownerName} ({formData.ownerTitle})
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Next Steps:</strong> {isAuthenticated ? "Click submit to send your business information for verification." : "You'll be asked to sign in, then we'll submit your business for verification. Our team will review and contact you within 2-3 business days."}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(3)}
                  variant="ghost"
                  data-testid="button-back-step4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="rounded-full px-8"
                  style={{
                    backgroundColor: 'hsl(158, 25%, 30%)',
                    color: 'white'
                  }}
                  data-testid="button-submit-business"
                >
                  {isAuthenticated ? "Submit for Verification" : "Sign In & Submit"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DbbCard>
      </DbbContainer>

      <Footer />
    </div>
  );
}
