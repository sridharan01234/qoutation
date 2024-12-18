// components/Avatar.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FiCamera } from "react-icons/fi";

export default function Avatar({ size = 40, editable = false }) {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      await update({ image: data.imageUrl });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`relative overflow-hidden ${
          editable ? "cursor-pointer" : ""
        } rounded-full`}
        style={{ width: size, height: size }}
        onClick={handleAvatarClick}
      >
        <Image
          src={session?.user?.image || "/default-avatar.png"}
          alt="Profile"
          fill
          className="object-cover"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
        {editable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity">
            <FiCamera className="hidden hover:block text-white text-xl" />
          </div>
        )}
      </div>
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
}
