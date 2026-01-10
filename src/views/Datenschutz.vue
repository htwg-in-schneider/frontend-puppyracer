<template>
  <div class="datenschutz-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/" class="breadcrumb-link">Startseite</router-link>
      <span class="separator">/</span>
      <span class="current">Datenschutzerklärung</span>
    </nav>

    <div class="container">
      <header class="page-header">
        <h1><i class="bi bi-shield-check" aria-hidden="true"></i> Datenschutzerklärung</h1>
        <p class="subtitle">Informationen gemäß Art. 12-14 DSGVO</p>
      </header>
      
      <main class="content">
        <!-- Zusammenfassung -->
        <section class="section" aria-labelledby="overview-title">
          <h2 id="overview-title">1. Datenschutz auf einen Blick</h2>
          <div class="alert-info">
            <p><strong>Wichtige Information:</strong> Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten auf dieser Website auf.</p>
          </div>
        </section>

        <!-- Verantwortlicher -->
        <section class="section" aria-labelledby="responsible-title">
          <h2 id="responsible-title">2. Verantwortlicher</h2>
          <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
          <div class="contact-card">
            <p><strong>PuppyRacer GmbH</strong><br>
            Musterstraße 123<br>
            78467 Konstanz<br>
            Deutschland</p>
            <p>
              <strong>E-Mail:</strong> 
              <a href="mailto:datenschutz@puppyracer.de">datenschutz@puppyracer.de</a><br>
              <strong>Telefon:</strong> +49 (0) 123 456789<br>
              <strong>Vertreten durch:</strong> Max Mustermann (Geschäftsführer)
            </p>
          </div>
          <p>Unser Datenschutzbeauftragter erreichen Sie unter:</p>
          <p><strong>Externer Datenschutzbeauftragter:</strong><br>
          Datenschutz GmbH<br>
          Datenschutzstraße 1<br>
          78467 Konstanz<br>
          E-Mail: <a href="mailto:datenschutz@datenschutz-gmbh.de">datenschutz@datenschutz-gmbh.de</a></p>
        </section>

        <!-- Erfassung allgemeiner Daten -->
        <section class="section" aria-labelledby="data-collection-title">
          <h2 id="data-collection-title">3. Erfassung und Speicherung personenbezogener Daten</h2>
          <h3>3.1 Beim Besuch der Website</h3>
          <p>Bei jedem Aufruf unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem Logfile gespeichert.</p>
          <p>Folgende Daten werden dabei erhoben:</p>
          <ul>
            <li>IP-Adresse des anfragenden Rechners</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
            <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
          </ul>
          <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 S. 1 lit. f DSGVO<br>
          <strong>Speicherdauer:</strong> 7 Tage</p>
          
          <h3>3.2 Bei Nutzung unseres Kontaktformulars</h3>
          <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
          <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 S. 1 lit. b DSGVO<br>
          <strong>Speicherdauer:</strong> 6 Monate nach Beendigung der Korrespondenz</p>
        </section>

        <!-- Cookies -->
        <section class="section" aria-labelledby="cookies-title">
          <h2 id="cookies-title">4. Cookies</h2>
          <p>Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.</p>
          <p>Wir verwenden folgende Cookie-Typen:</p>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cookie-Typ</th>
                  <th>Zweck</th>
                  <th>Speicherdauer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Notwendige Cookies</td>
                  <td>Grundfunktionen der Website</td>
                  <td>Sitzungsende</td>
                </tr>
                <tr>
                  <td>Funktionale Cookies</td>
                  <td>Warenkorb, Login-Status</td>
                  <td>30 Tage</td>
                </tr>
                <tr>
                  <td>Statistik-Cookies</td>
                  <td>Analyse der Website-Nutzung (nur mit Einwilligung)</td>
                  <td>13 Monate</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Sie können Cookies in Ihren Browsereinstellungen jederzeit löschen oder die Speicherung von Cookies generell untersagen.</p>
        </section>

        <!-- Dienste Dritter -->
        <section class="section" aria-labelledby="third-party-title">
          <h2 id="third-party-title">5. Eingesetzte Dienste Dritter</h2>
          <h3>5.1 Auth0 (Authentifizierung)</h3>
          <p>Wir verwenden Auth0 für die Benutzerauthentifizierung. Anbieter: Auth0 Inc., 10800 NE 8th St #700, Bellevue, WA 98004, USA.</p>
          <p><strong>Verarbeitete Daten:</strong> E-Mail, Name, IP-Adresse<br>
          <strong>Zweck:</strong> Sichere Benutzerauthentifizierung<br>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO<br>
          <strong>Datenschutzerklärung:</strong> <a href="https://auth0.com/privacy" target="_blank" rel="noopener noreferrer">https://auth0.com/privacy</a></p>
          
          <h3>5.2 Render.com (Hosting)</h3>
          <p>Unser Backend wird auf Render.com gehostet. Anbieter: Render Inc., 440 N Barranca Ave #5136, Covina, CA 91723, USA.</p>
          <p><strong>Datenschutzerklärung:</strong> <a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer">https://render.com/privacy</a></p>
        </section>

        <!-- Ihre Rechte -->
        <section class="section" aria-labelledby="rights-title">
          <h2 id="rights-title">6. Ihre Rechte</h2>
          <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
          <ul>
            <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
            <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
            <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
            <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
            <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong>Recht auf Widerspruch</strong> (Art. 21 DSGVO)</li>
            <li><strong>Recht auf Beschwerde</strong> bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>
          <p>Um Ihre Rechte auszuüben, wenden Sie sich bitte an unseren Datenschutzbeauftragten.</p>
        </section>

        <!-- Änderungen -->
        <section class="section" aria-labelledby="changes-title">
          <h2 id="changes-title">7. Änderungen dieser Datenschutzerklärung</h2>
          <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.</p>
          <p><strong>Stand:</strong> Dezember 2024</p>
        </section>

        <!-- Kontakt -->
        <section class="section" aria-labelledby="contact-title">
          <h2 id="contact-title">8. Kontakt zum Datenschutz</h2>
          <p>Für Fragen zum Datenschutz kontaktieren Sie uns bitte:</p>
          <div class="contact-options">
            <div class="contact-option">
              <i class="bi bi-envelope" aria-hidden="true"></i>
              <div>
                <strong>Per E-Mail:</strong><br>
                <a href="mailto:datenschutz@puppyracer.de">datenschutz@puppyracer.de</a>
              </div>
            </div>
            <div class="contact-option">
              <i class="bi bi-telephone" aria-hidden="true"></i>
              <div>
                <strong>Per Telefon:</strong><br>
                +49 (0) 123 456789
              </div>
            </div>
            <div class="contact-option">
              <i class="bi bi-house" aria-hidden="true"></i>
              <div>
                <strong>Per Post:</strong><br>
                PuppyRacer GmbH<br>
                Musterstraße 123<br>
                78467 Konstanz
              </div>
            </div>
          </div>
        </section>

        <!-- Navigation -->
        <div class="navigation-buttons">
          <router-link to="/impressum" class="btn-secondary">
            <i class="bi bi-file-text" aria-hidden="true"></i> Zum Impressum
          </router-link>
          <router-link to="/" class="btn-primary">
            <i class="bi bi-house" aria-hidden="true"></i> Zurück zur Startseite
          </router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// Kein Script nötig
</script>

<style scoped>
.datenschutz-page {
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
  background: linear-gradient(135deg, var(--color-primary-dark), #2d3748);
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

p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #555;
}

/* Alert */
.alert-info {
  background: rgba(13, 110, 253, 0.1);
  border-left: 4px solid #0d6efd;
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
  margin: 1.5rem 0;
}

/* Contact Card */
.contact-card {
  background: #f8f9fa;
  border-left: 4px solid var(--color-accent-pink);
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
  margin: 1.5rem 0;
}

.contact-card p {
  margin-bottom: 0.5rem;
}

.contact-card a {
  color: var(--color-accent-pink);
  text-decoration: none;
}

.contact-card a:hover {
  text-decoration: underline;
}

/* Lists */
ul {
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}

li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

/* Table */
.table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead {
  background: var(--color-primary-dark);
  color: white;
}

th, td {
  padding: 1rem;
  text-align: left;
  border: 1px solid #dee2e6;
}

tbody tr:nth-child(even) {
  background: #f8f9fa;
}

/* Contact Options */
.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.contact-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.contact-option i {
  font-size: 1.5rem;
  color: var(--color-accent-pink);
  margin-top: 0.25rem;
}

.contact-option strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-primary-dark);
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
  .datenschutz-page {
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
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .contact-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .table-container {
    font-size: 0.85rem;
  }
  
  th, td {
    padding: 0.75rem;
  }
}
</style>