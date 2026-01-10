<template>
  <div class="impressum-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/" class="breadcrumb-link">Startseite</router-link>
      <span class="separator">/</span>
      <span class="current">Impressum</span>
    </nav>

    <div class="container">
      <header class="page-header">
        <h1><i class="bi bi-info-circle" aria-hidden="true"></i> Impressum</h1>
        <p class="subtitle">Angaben gemäß § 5 DDG (vormals TMG)</p>
      </header>
      
      <main class="content">
        <!-- Diensteanbieter -->
        <section class="section" aria-labelledby="provider-title">
          <h2 id="provider-title">1. Diensteanbieter</h2>
          <div class="company-card">
            <div class="company-logo">
              <i class="bi bi-building" aria-hidden="true"></i>
            </div>
            <div class="company-details">
              <h3>PuppyRacer GmbH</h3>
              <div class="detail">
                <i class="bi bi-geo-alt" aria-hidden="true"></i>
                <span>Musterstraße 123<br>78467 Konstanz<br>Deutschland</span>
              </div>
              <div class="detail">
                <i class="bi bi-telephone" aria-hidden="true"></i>
                <span>+49 (0) 123 456789</span>
              </div>
              <div class="detail">
                <i class="bi bi-envelope" aria-hidden="true"></i>
                <span><a href="mailto:info@puppyracer.de">info@puppyracer.de</a></span>
              </div>
              <div class="detail">
                <i class="bi bi-globe" aria-hidden="true"></i>
                <span><a href="https://www.puppyracer.de" target="_blank" rel="noopener noreferrer">www.puppyracer.de</a></span>
              </div>
            </div>
          </div>
        </section>

        <!-- Vertretungsberechtigte -->
        <section class="section" aria-labelledby="management-title">
          <h2 id="management-title">2. Vertretungsberechtigte Geschäftsführung</h2>
          <div class="management-grid">
            <div class="manager-card">
              <div class="manager-avatar">
                <i class="bi bi-person-fill" aria-hidden="true"></i>
              </div>
              <div class="manager-details">
                <h4>Max Mustermann</h4>
                <p>Geschäftsführer<br>Verantwortlich für: Strategie & Vertrieb</p>
              </div>
            </div>
            <div class="manager-card">
              <div class="manager-avatar">
                <i class="bi bi-person-fill" aria-hidden="true"></i>
              </div>
              <div class="manager-details">
                <h4>Erika Musterfrau</h4>
                <p>Geschäftsführerin<br>Verantwortlich für: Marketing & Logistik</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Registereintrag -->
        <section class="section" aria-labelledby="register-title">
          <h2 id="register-title">3. Registereintrag</h2>
          <div class="register-info">
            <div class="register-item">
              <strong>Handelsregister:</strong>
              <p>Amtsgericht Konstanz<br>HRB 12345</p>
            </div>
            <div class="register-item">
              <strong>Umsatzsteuer-Identifikationsnummer:</strong>
              <p>DE123456789</p>
            </div>
            <div class="register-item">
              <strong>Wirtschafts-Identifikationsnummer:</strong>
              <p>12345678</p>
            </div>
          </div>
        </section>

        <!-- Verantwortlich für den Inhalt -->
        <section class="section" aria-labelledby="content-title">
          <h2 id="content-title">4. Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>Max Mustermann<br>Musterstraße 123<br>78467 Konstanz<br>Deutschland</p>
          <p class="notice">Die verantwortliche Stelle i.S.d. Datenschutz-Grundverordnung und anderer nationaler Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist die oben genannte Firma.</p>
        </section>

        <!-- Haftungshinweise -->
        <section class="section" aria-labelledby="liability-title">
          <h2 id="liability-title">5. Haftungshinweise</h2>
          <h3>5.1 Haftung für Inhalte</h3>
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
          
          <h3>5.2 Haftung für Links</h3>
          <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
          
          <h3>5.3 Urheberrecht</h3>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
        </section>

        <!-- Streitschlichtung -->
        <section class="section" aria-labelledby="dispute-title">
          <h2 id="dispute-title">6. Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a></p>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </section>

        <!-- Weitere rechtliche Hinweise -->
        <section class="section" aria-labelledby="legal-title">
          <h2 id="legal-title">7. Weitere rechtliche Hinweise</h2>
          <div class="legal-notices">
            <div class="legal-notice">
              <i class="bi bi-shield-check" aria-hidden="true"></i>
              <div>
                <h4>Datenschutz</h4>
                <p>Informationen zum Datenschutz finden Sie in unserer <router-link to="/datenschutz">Datenschutzerklärung</router-link>.</p>
              </div>
            </div>
            <div class="legal-notice">
              <i class="bi bi-file-text" aria-hidden="true"></i>
              <div>
                <h4>Allgemeine Geschäftsbedingungen (AGB)</h4>
                <p>Unsere Allgemeinen Geschäftsbedingungen können Sie <a href="/agb" target="_blank">hier einsehen</a>.</p>
              </div>
            </div>
            <div class="legal-notice">
              <i class="bi bi-cart-check" aria-hidden="true"></i>
              <div>
                <h4>Widerrufsrecht</h4>
                <p>Informationen zu Ihrem Widerrufsrecht finden Sie in unseren <a href="/widerruf" target="_blank">Widerrufsbelehrungen</a>.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Kontakt & Aktualisierung -->
        <section class="section" aria-labelledby="update-title">
          <h2 id="update-title">8. Kontakt & Aktualisierung</h2>
          <div class="contact-box">
            <p>Bei Fragen zum Impressum oder zur Aktualisierung der Angaben kontaktieren Sie uns bitte:</p>
            <div class="contact-methods">
              <a href="mailto:impressum@puppyracer.de" class="contact-method">
                <i class="bi bi-envelope" aria-hidden="true"></i>
                <span>impressum@puppyracer.de</span>
              </a>
              <a href="tel:+49123456789" class="contact-method">
                <i class="bi bi-telephone" aria-hidden="true"></i>
                <span>+49 (0) 123 456789</span>
              </a>
              <a href="/contact" class="contact-method">
                <i class="bi bi-chat-left-text" aria-hidden="true"></i>
                <span>Kontaktformular</span>
              </a>
            </div>
          </div>
          <p class="update-notice"><strong>Letzte Aktualisierung:</strong> Dezember 2024</p>
        </section>

        <!-- Navigation -->
        <div class="navigation-buttons">
          <router-link to="/datenschutz" class="btn-secondary">
            <i class="bi bi-shield-check" aria-hidden="true"></i> Zur Datenschutzerklärung
          </router-link>
          <router-link to="/" class="btn-primary">
            <i class="bi bi-house" aria-hidden="true"></i> Zurück zur Startseite
          </router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.impressum-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 120px 20px 60px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.breadcrumb-link {
  color: var(--color-accent-pink);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.separator {
  opacity: 0.5;
}

.current {
  font-weight: 600;
  color: var(--color-primary-dark);
}

/* Container */
.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #B48665, #8b7355);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Content */
.content {
  padding: 3rem 2rem;
  color: var(--color-primary-dark);
}

/* Sections */
.section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

h2 {
  color: var(--color-primary-dark);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

h3 {
  color: var(--color-secondary);
  font-size: 1.4rem;
  margin: 1.5rem 0 1rem;
  font-weight: 600;
}

h4 {
  color: #333;
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #555;
}

/* Company Card */
.company-card {
  display: flex;
  gap: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e9ecef;
  margin: 1.5rem 0;
}

.company-logo {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: var(--color-accent-pink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-logo i {
  font-size: 2.5rem;
  color: white;
}

.company-details h3 {
  margin-top: 0;
  color: var(--color-primary-dark);
  font-size: 1.8rem;
}

.detail {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail i {
  color: var(--color-accent-pink);
  font-size: 1.2rem;
  margin-top: 0.25rem;
  min-width: 20px;
}

.detail a {
  color: var(--color-accent-pink);
  text-decoration: none;
}

.detail a:hover {
  text-decoration: underline;
}

/* Management Grid */
.management-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.manager-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  transition: all 0.3s;
}

.manager-card:hover {
  border-color: var(--color-accent-pink);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.manager-avatar {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manager-avatar i {
  font-size: 2rem;
  color: var(--color-secondary);
}

.manager-details h4 {
  margin-bottom: 0.5rem;
  color: var(--color-primary-dark);
}

.manager-details p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0;
}

/* Register Info */
.register-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.register-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--color-secondary);
}

.register-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary-dark);
}

/* Notice */
.notice {
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
  margin: 1.5rem 0;
  color: #856404;
}

/* Legal Notices */
.legal-notices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.legal-notice {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.legal-notice i {
  font-size: 1.5rem;
  color: var(--color-accent-pink);
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.legal-notice h4 {
  margin-bottom: 0.5rem;
}

.legal-notice p {
  margin-bottom: 0;
  font-size: 0.95rem;
}

.legal-notice a {
  color: var(--color-accent-pink);
  text-decoration: none;
}

.legal-notice a:hover {
  text-decoration: underline;
}

/* Contact Box */
.contact-box {
  background: rgba(226, 97, 145, 0.05);
  border: 1px solid rgba(226, 97, 145, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin: 1.5rem 0;
}

.contact-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}

.contact-method {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid rgba(226, 97, 145, 0.3);
  border-radius: 8px;
  color: var(--color-accent-pink);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.contact-method:hover {
  background: var(--color-accent-pink);
  color: white;
  transform: translateY(-2px);
}

.contact-method i {
  font-size: 1.2rem;
}

.update-notice {
  text-align: right;
  font-size: 0.95rem;
  color: #666;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--color-accent-pink);
  color: white;
  border: 2px solid var(--color-accent-pink);
}

.btn-primary:hover {
  background: #d05583;
  border-color: #d05583;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: var(--color-primary-dark);
  border: 2px solid var(--color-primary-dark);
}

.btn-secondary:hover {
  background: var(--color-primary-dark);
  color: white;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .impressum-page {
    padding: 100px 1rem 2rem;
  }
  
  .page-header {
    padding: 2rem 1rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .content {
    padding: 2rem 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.2rem;
  }
  
  .company-card {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .detail {
    justify-content: center;
  }
  
  .management-grid,
  .register-info,
  .legal-notices {
    grid-template-columns: 1fr;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .contact-methods {
    flex-direction: column;
  }
  
  .contact-method {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .manager-card {
    flex-direction: column;
    text-align: center;
  }
  
  .manager-avatar {
    margin: 0 auto;
  }
}
</style>