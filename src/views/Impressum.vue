<template>
  <div class="impressum-page">
    <div class="container">
      <h1>Impressum</h1>
      
      <div class="content">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p><strong>PuppyRacer GmbH</strong></p>
        <p>Musterstraße 123</p>
        <p>78467 Konstanz</p>
        <p>Deutschland</p>
        
        <h2>Vertreten durch</h2>
        <p>Max Mustermann (Geschäftsführer)</p>
        
        <h2>Kontakt</h2>
        <p>Telefon: +49 (0) 123 456789</p>
        <p>E-Mail: info@puppyracer.de</p>
        
        <h2>Registereintrag</h2>
        <p>Eintragung im Handelsregister.</p>
        <p>Registergericht: Amtsgericht Musterstadt</p>
        <p>Registernummer: HRB 12345</p>
        
        <h2>Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß §27a UStG: DE123456789</p>
        
        <router-link to="/" class="back-btn">
          ← Zurück zur Startseite
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.impressum-page {
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
  margin-bottom: 0.5rem;
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