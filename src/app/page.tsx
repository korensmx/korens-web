"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Packages from "@/components/Packages";
import Services from "@/components/Services";
import ConsultantMethod from "@/components/ConsultantMethod";
import SocialFeed from "@/components/SocialFeed";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import DiagnosticModal from "@/components/DiagnosticModal";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-korens-bg text-slate-100 flex flex-col selection:bg-korens-orange selection:text-white">
      {/* Header Sticky */}
      <Header onOpenDiagnostic={() => setIsDiagnosticOpen(true)} />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectPackageTarget={() => {
            const el = document.getElementById("paquetes");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        {/* 3 Main Packages with Offers */}
        <Packages onSelectProduct={handleSelectProduct} />

        {/* Individual Services (A la Carta) */}
        <Services onSelectProduct={handleSelectProduct} />

        {/* Consultant & 3-Minute Diagnostic Quiz */}
        <ConsultantMethod onOpenDiagnosticModal={() => setIsDiagnosticOpen(true)} />

        {/* Real-time Multimedia Social Feed (YouTube + Instagram) */}
        <SocialFeed />

        {/* Blog Magazine & Interactive Comments */}
        <BlogSection />

        {/* Testimonials with 15s Video Option & Interactive Rating */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Elements */}
      <WhatsAppFloating />

      {/* Checkout Modal with Lead Capture & Mercado Pago Redirection */}
      <CheckoutModal
        product={selectedProduct}
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Diagnostic Modal */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
    </div>
  );
}
