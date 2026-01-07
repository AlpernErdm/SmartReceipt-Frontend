"use client";

import { useEffect } from "react";

export function IyzicoScript() {
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="iyzipay"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.iyzipay.com/tr/iyzipay.min.js";
    script.async = true;
    script.onload = () => {
      console.log("iyzico.js loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load iyzico.js");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src*="iyzipay"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}

