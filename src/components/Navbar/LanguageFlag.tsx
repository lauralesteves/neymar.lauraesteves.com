import { Link } from 'react-router-dom';
import { buildLocalePath, useLocale } from '../../i18n/LocaleContext';

export function LanguageFlag() {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2">
      {t.alternates.map((site) => (
        <Link
          key={site.locale}
          to={buildLocalePath(site.locale)}
          className="hover:opacity-80 transition-opacity"
        >
          <img src={site.flag} alt={site.label} className="w-7 h-[18px]" />
        </Link>
      ))}
    </div>
  );
}
