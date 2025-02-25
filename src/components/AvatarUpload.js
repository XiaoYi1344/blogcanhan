import { useState } from "react";

export default function AvatarUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer">
        <img
          src={preview || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border shadow-lg"
        />
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}
