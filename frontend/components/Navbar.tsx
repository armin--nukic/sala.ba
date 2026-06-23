"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { BrandLogo } from "@/components/BrandLogo";
import styles from "./Navbar.module.css";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const links = [
    ["/", t.home],
    ["/sale", t.venues],
    ["/sale-za-vjencanja", t.wedding],
    ["/sport-sale", t.sport],
    ["/dijaspora", t.diaspora],
    ["/forum", "Forum"],
    ["/about", t.about],
    ["/contact", t.contact]
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.body.style.overflow = open ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={clsx("container", styles.nav)}>
        <Link href="/dashboard" className={styles.logo} onClick={() => setOpen(false)} title="Dashboard">
          <BrandLogo />
        </Link>
        <button className={styles.menuButton} onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open} aria-controls="main-navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        {open && <button className={styles.backdrop} aria-label="Close menu" onClick={() => setOpen(false)} type="button" />}
        <nav id="main-navigation" className={clsx(styles.links, open && styles.open)}>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(pathname === href && styles.active)}
            >
              {label}
            </Link>
          ))}
          <Link href="/dashboard" className={clsx(pathname === "/dashboard" && styles.active)}>
            {t.dashboard}
          </Link>
          <Link href="/admin" className={clsx(pathname === "/admin" && styles.active)}>
            {t.admin}
          </Link>
          <div className={styles.actions}>
            <div className={styles.langGroup} aria-label={t.language}>
              <button className={clsx(styles.lang, lang === "bs" && styles.selected)} onClick={() => setLang("bs")} type="button" title="Bosanski">
                <span className={clsx(styles.flag, styles.flagBs)} /> BS
              </button>
              <button className={clsx(styles.lang, lang === "en" && styles.selected)} onClick={() => setLang("en")} type="button" title="English">
                <span className={clsx(styles.flag, styles.flagEn)} /> EN
              </button>
            </div>
            <button className={styles.themeButton} onClick={toggleTheme} type="button" title={theme === "dark" ? t.lightMode : t.darkMode} aria-label={theme === "dark" ? t.lightMode : t.darkMode}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <button className="btn btn-ghost" onClick={logout}>
                {t.logout}
              </button>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">
                  {t.login}
                </Link>
                <Link href="/register" className="btn btn-primary">
                  {t.register}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
