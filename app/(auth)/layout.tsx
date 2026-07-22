"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import bg from "@/assets/images/1661.jpg";
import appstore from "@/assets/images/appstore.png";
import playstore from "@/assets/images/playstore.png";
import { Globe, Phone, Mail, Smartphone } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main>
      <div className="flex-grow">{children}</div>
    </main>
  );
}
