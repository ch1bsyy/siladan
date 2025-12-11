import React from "react";
import ProfilePictureCard from "../features/profile/components/ProfilePictureCard";
import PasswordChangeForm from "../features/profile/components/PasswordChangeForm";
import UserDataDisplay from "../features/profile/components/UserDataDisplay";

const DashboardProfilePage = () => {
  return (
    <div>
      <div className="container mx-auto px-1 sm:px-6 lg:px-8">
        {/* Title Section */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#053F5C] dark:text-white mb-8 text-center md:text-left">
          Profil Pengguna
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-1">
            <ProfilePictureCard />
          </div>

          <div className="md:col-span-2">
            <UserDataDisplay />
            <div className="mt-6 lg:mt-8">
              <PasswordChangeForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfilePage;
