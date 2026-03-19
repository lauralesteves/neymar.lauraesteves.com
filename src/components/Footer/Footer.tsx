import { useLocale } from '../../i18n/LocaleContext';

const currentYear = new Date().getFullYear();

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white text-center py-3 text-sm font-body">
      <p className="font-bold uppercase">
        {t.footer.tagline}
      </p>
      <p>
        &copy; {currentYear} | {t.footer.madeWith}{' '}
        <a
          href={t.nav.lauraUrl}
          target="_blank"
          className="font-bold hover:opacity-80 transition-opacity"
          rel="noreferrer"
        >
          Laura Esteves
        </a>
      </p>
    </footer>
  );
}
