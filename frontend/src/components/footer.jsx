export default function Footer() {
  return (
    <footer style={{
      padding: '50px 80px',
      background: 'gainsboro',
      borderTop: '1px solid #eee',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={styles.topSection}>
        <div style={styles.leftBlock}>
          <h2 style={styles.brand}>
            <span style={styles.logo}></span>
            Untitled UI
          </h2>

          <p style={styles.description}>
            Design amazing digital experiences that <br />
            create more happy in the world.
          </p>

          <div style={styles.linksRow}>
            <a style={styles.link}>Overview</a>
            <a style={styles.link}>Features</a>
            <a style={styles.link}>Pricing</a>
            <a style={styles.link}>Careers</a>
            <a style={styles.link}>Help</a>
            <a style={styles.link}>Privacy</a>
          </div>
        </div>

        {/* Jobb oldal */}
        <div style={styles.rightBlock}>
          <h4 style={styles.getApp}>Get the app</h4>

          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            style={styles.storeBadge}
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            style={styles.storeBadge}
          />
        </div>
      </div>

      <hr style={styles.line} />

      <div style={styles.bottomSection}>
        <p style={styles.copy}>© 2077 Untitled UI. All rights reserved.</p>

        <div style={styles.iconRow}>
          <span style={styles.icon}>✖</span>
          <span style={styles.icon}>in</span>
          <span style={styles.icon}>f</span>
          <span style={styles.icon}>🌐</span>
          <span style={styles.icon}>✌️</span>
          <span style={styles.icon}>🏀</span>
          <span style={styles.icon}>📦</span>
        </div>
      </div>
    </footer>
  );
}


const styles = {
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px",
  },
  leftBlock: {
    maxWidth: "450px",
  },
  brand: {
    fontSize: "28px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "30px",
    height: "30px",
    background: "linear-gradient(45deg, #b76fff, #7f3cff)",
    borderRadius: "10px",
    display: "inline-block"
  },
  description: {
    marginTop: "10px",
    color: "#555",
    lineHeight: "1.5",
  },
  linksRow: {
    marginTop: "20px",
    display: "flex",
    gap: "25px",
    fontSize: "16px",
  },
  link: {
    color: "#3a3a3a",
    cursor: "pointer",
  },
  rightBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "flex-end",
  },
  getApp: {
    marginBottom: "10px",
    color: "#444",
  },
  storeBadge: {
    width: "150px",
    height: "auto",
    cursor: "pointer",
  },
  line: {
    border: "none",
    height: "1px",
    background: "#eee",
    margin: "20px 0",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copy: {
    color: "#777",
  },
  iconRow: {
    display: "flex",
    gap: "20px",
    fontSize: "20px",
    color: "#999",
  },
  icon: {
    cursor: "pointer"
  },
};
