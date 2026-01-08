<template>
  <div class="datenschutz-page">
    <div class="container">
      <h1>Datenschutzerklärung</h1>
      
      <div class="content">
        <h2>1. Datenschutz auf einen Blick</h2>
        <p>Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten auf dieser Website auf.</p>
        
        <h2>2. Verantwortlicher</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <p><strong>PuppyRacer GmbH</strong><br>
        Musterstraße 123<br>
        12345 Musterstadt<br>
        E-Mail: info@puppyracer.de</p>
        
        <h2>3. Erfassung und Speicherung personenbezogener Daten</h2>
        <p>Bei Besuch unserer Website werden automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem Logfile gespeichert.</p>
        
        <h2>4. Kontaktformular</h2>
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
        
        <h2>5. Ihre Rechte</h2>
        <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer personenbezogenen Daten.</p>
        
        <router-link to="/" class="back-btn">
          ← Zurück zur Startseite
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Kein Script nötig
</script>

<style scoped>
.datenschutz-page {
  padding: 3rem 1rem;
  background-color: #EFE1D6;
  min-height: 70vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

h1 {
  color: #2D2121;
  font-family: "Roboto", sans-serif;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  border-bottom: 3px solid #E26191;
  padding-bottom: 0.5rem;
}

h2 {
  color: #B48665;
  font-family: "Roboto", sans-serif;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

p {
  font-family: "Roboto", sans-serif;
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.back-btn {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #E26191;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-family: "Roboto", sans-serif;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #d04a7c;
}

@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>