import styles from "./BrandLogo.module.css";

export function BrandLogo() {
  return (
    <span className={styles.logo} aria-label="sala.ba">
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 64 64" focusable="false">
          <defs>
            <linearGradient id="salaLogoGradient" x1="8" y1="7" x2="57" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0f766e" />
              <stop offset=".48" stopColor="#2563eb" />
              <stop offset="1" stopColor="#be123c" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="56" height="56" rx="18" />
          <path className={styles.logoArch} d="M15 37C15 24.9 22.6 16 32 16s17 8.9 17 21" />
          <path className={styles.logoFloor} d="M17 44H47" />
          <path className={styles.logoDoor} d="M26 44V34.5C26 30.9 28.7 28 32 28s6 2.9 6 6.5V44" />
          <path className={styles.logoSpark} d="M49 12l1.7 4.2 4.3 1.4-4.3 1.6L49 23l-1.7-3.8-4.3-1.6 4.3-1.4L49 12Z" />
          <circle cx="20" cy="22" r="3" />
        </svg>
      </span>
      <span className={styles.word}>
        <span className={styles.wordMain}>sala</span><span className={styles.wordDot}>.ba</span>
      </span>
    </span>
  );
}
