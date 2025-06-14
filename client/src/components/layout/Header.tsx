
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    setIsLanguageOpen(false);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'am' ? t('languages.amharic') : t('languages.english');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">{t('header.adminDashboard')}</h1>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <Globe size={16} />
                <span className="text-sm">{getCurrentLanguageLabel()}</span>
                <ChevronDown size={14} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                {t('languages.english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('am')}>
                {t('languages.amharic')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu open={isUserOpen} onOpenChange={setIsUserOpen}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <span className="text-sm">{t('header.admin')}</span>
                <ChevronDown size={14} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                {t('header.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                {t('header.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
