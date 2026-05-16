import React from 'react';
import { useProfileLogic } from '../../hooks/user/useProfileLogic';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';

const ProfileInfoPage = () => {
  const { formData, handleChange, saveProfile } = useProfileLogic();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfile();
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
          Informasi <span className="text-[#2D5A43]">Profil.</span>
        </h3>
        <p className="text-sm text-gray-400 mt-1 font-medium">Kelola informasi data diri Anda</p>
      </div>

      <form className="space-y-5" onSubmit={handleSaveProfile}>
        <FormInput
          label="Nama"
          name="username"
          type="text"
          value={formData?.username || ''}
          onChange={handleChange}
          placeholder="Masukkan nama Anda"
          required
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData?.email || ''}
          placeholder="Masukkan email Anda"
          onChange={handleChange}
          required
        />
        <FormInput
          label="Nomor Telepon"
          name="phone"
          type="text"
          value={formData?.phone || ''}
          onChange={handleChange}
          placeholder="Contoh: 08123456789"
          required
        />

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-gray-50">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-10 py-3 text-sm"
            onClick={() => window.history.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto px-10 py-3 text-sm shadow-lg shadow-[#2D5A43]/10"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoPage;