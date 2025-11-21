import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
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

export default function BusinessOnboardingSubmit() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/business-onboarding');
      return;
    }

    const savedData = localStorage.getItem('businessOnboardingData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      navigate('/business-onboarding');
    }
  }, [user, authLoading, navigate]);

  const submitMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      return apiRequest("POST", "/api/verification-requests", {
        businessName: data.businessName,
        category: data.category,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
        email: data.email,
        website: data.website || null,
        description: data.description,
        submitterName: data.ownerName,
        submitterRole: data.ownerTitle,
      });
    },
    onSuccess: () => {
      localStorage.removeItem('businessOnboardingData');
      setSubmitted(true);
      toast({
        title: "Submission Successful",
        description: "Your business has been submitted for verification.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (formData) {
      submitMutation.mutate(formData);
    }
  };

  if (authLoading || !formData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <DbbContainer className="py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-dbb-forestGreen" />
        </DbbContainer>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <DbbContainer className="py-12 md:py-20 max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 rounded-full bg-green-100">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            <h1 
              className="text-3xl md:text-4xl text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Submission Complete!
            </h1>
            
            <p className="text-lg text-dbb-charcoalSoft">
              Thank you for submitting your business to Dallas Beauty Book. Our team will review your information and contact you within 2-3 business days.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-dbb-charcoal mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-dbb-charcoalSoft">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-dbb-forestGreen mt-0.5 flex-shrink-0" />
                  <span>Our team will verify your business information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-dbb-forestGreen mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email confirmation once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-dbb-forestGreen mt-0.5 flex-shrink-0" />
                  <span>You can then claim your listing and start engaging with clients</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Button
                onClick={() => navigate('/')}
                className="rounded-full px-8"
                style={{
                  backgroundColor: 'hsl(158, 25%, 30%)',
                  color: 'white'
                }}
                data-testid="button-return-home"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </DbbContainer>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DbbContainer className="py-12 md:py-20 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex p-6 rounded-full bg-dbb-cream">
            <AlertCircle className="h-16 w-16 text-dbb-forestGreen" />
          </div>
          
          <h1 
            className="text-3xl md:text-4xl text-dbb-charcoal"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ready to Submit?
          </h1>
          
          <p className="text-lg text-dbb-charcoalSoft">
            You're about to submit <strong>{formData.businessName}</strong> for verification. Our team will review your business information within 2-3 business days.
          </p>

          <div className="bg-dbb-cream p-6 rounded-lg text-left space-y-3">
            <div>
              <p className="text-sm text-dbb-charcoalSoft">Business</p>
              <p className="font-semibold text-dbb-charcoal">{formData.businessName} - {formData.category}</p>
            </div>
            <div>
              <p className="text-sm text-dbb-charcoalSoft">Location</p>
              <p className="font-semibold text-dbb-charcoal">
                {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
              </p>
            </div>
            <div>
              <p className="text-sm text-dbb-charcoalSoft">Contact</p>
              <p className="font-semibold text-dbb-charcoal">{formData.phone} • {formData.email}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate('/business-onboarding')}
              variant="outline"
              data-testid="button-edit-info"
            >
              Edit Information
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="rounded-full px-8"
              style={{
                backgroundColor: 'hsl(158, 25%, 30%)',
                color: 'white'
              }}
              data-testid="button-confirm-submit"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </Button>
          </div>
        </div>
      </DbbContainer>
      <Footer />
    </div>
  );
}
