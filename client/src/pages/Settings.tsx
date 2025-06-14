// src/pages/Settings.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Languages } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en"
  );

  const handleSaveChanges = () => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("i18nextLng", selectedLanguage);
    toast.success(t("settings.changesSaved"));
  };

  return (
    <Layout>
      {/*
        Removed max-w-2xl and mx-auto.
        Added p-6 to match the Dashboard's outer padding and allow content to span.
        The 'flex flex-col w-full' ensures it takes available width.
      */}
      <div className="flex flex-col w-full p-6 min-h-screen">
        {/* The h1 and the main settings card will now sit within this padded area */}
        <h1 className="text-2xl font-bold text-white mb-6">
          {t("settings.title")}
        </h1>

        {/* This div will now take the full width of the padded area */}
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="text-blue-400" size={24} />
            <div>
              <h2 className="text-white text-lg font-semibold">
                {t("settings.language")}
              </h2>
              <p className="text-slate-400 text-sm">
                {t("settings.languagePreferences")}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-slate-300 text-sm mb-4 block">
              {t("settings.selectLanguage")}
            </label>

            <RadioGroup
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 bg-slate-700 border border-slate-600 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                <RadioGroupItem value="en" id="english" />
                <Label
                  htmlFor="english"
                  className="text-white cursor-pointer flex-1"
                >
                  {t("languages.english")}
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-slate-700 border border-slate-600 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                <RadioGroupItem value="am" id="amharic" />
                <Label
                  htmlFor="amharic"
                  className="text-white cursor-pointer flex-1"
                >
                  {t("languages.amharic")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t("settings.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
