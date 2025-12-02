import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../components/Input";
import { FiCamera, FiEdit2, FiSave, FiX } from "react-icons/fi";

const ProfilePictureCard = () => {
  const { user } = useAuth(); // assumption that there is an updateUser function in the context
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleSaveName = () => {
    // Call the API/context function to update the name
    // updateUser({ name: editedName }); // Example
    console.log("Saving name:", editedName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || "");
    setIsEditingName(false);
  };

  const handleChangePicture = () => {
    console.log("Trigger change picture logic");
    // Usually opens a template or input file
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 text-center">
      {/* Profile Picture */}

      <div className="relative mb-4 group">
        <img
          src={
            user.avatar ||
            `https://placehold.co/128x128/EBF5FF/053F5C?text=${
              user.name?.[0] || "U"
            }`
          }
          onClick={handleChangePicture}
          alt="Foto Profil"
          className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700 mx-auto cursor-pointer"
        />

        <button
          onClick={handleChangePicture}
          className="absolute bottom-0 right-0 bg-[#429EBD] group-hover:bg-[#053F5C] text-white p-2 rounded-full shadow-md transition-colors cursor-pointer"
          aria-label="Ganti foto profil"
        >
          <FiCamera size={20} />
        </button>
      </div>

      {/* User Name */}

      <div className="w-full mt-4">
        {isEditingName ? (
          <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
            <Input
              id="edit-name"
              value={editedName}
              onChange={handleNameChange}
              className="items-center"
            />

            <div className="flex items-center justify-center gap-2 mt-1">
              <button
                onClick={handleSaveName}
                className="p-2 flex items-center gap-2 justify-center min-h-[44px] min-w-[44px] bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer"
                aria-label="Simpan nama"
              >
                <FiSave size={20} />
              </button>

              <button
                onClick={handleCancelEdit}
                className="p-2 flex items-center justify-center min-h-[44px] min-w-[44px] bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
                aria-label="Batal edit nama"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
              {user.name || "Nama Pengguna"}
            </h2>

            <button
              onClick={() => setIsEditingName(true)}
              className="text-slate-500 hover:text-[#429EBD] cursor-pointer"
              aria-label="Edit nama"
            >
              <FiEdit2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Role */}

      <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400">
        {user?.role?.name || "Role Pengguna"}
      </p>
    </div>
  );
};

export default ProfilePictureCard;
