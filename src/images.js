// src/images.js
// Alle Produktbilder importieren
import HundeleineDunklesLeder from '@/assets/product_pics/Hundeleine-dunklesLeder.png'
import HundeleineRot from '@/assets/product_pics/Hundeleine-rot.png'
import HundeleineStoff from '@/assets/product_pics/Hundeleine-Stoff.png'
import HalsbandTuerkis from '@/assets/product_pics/Hundehalsband-Türkis.png'
import HalsbandLeder from '@/assets/product_pics/Hundehalsband-Leder.png'
import HalsbandPremium from '@/assets/product_pics/Hundehalsband-premium.png'
import JackeBlau from '@/assets/product_pics/Hundejacke-Blau.png'
import Pulli from '@/assets/product_pics/HundePulli.png'
import JackeSchwarz from '@/assets/product_pics/Hundejacke-Schwarz.png'
import Pedigree from '@/assets/product_pics/Pedigree-Futter.png'
import ActivaGold from '@/assets/product_pics/Activa-Gold-Futter.png'
import Nutrima from '@/assets/product_pics/Nutrima-Futter.png'
import DefaultImage from '@/assets/product_pics/default.jpg'

// 1. Bildermap für den Zugriff per Produkt-ID
export const productImages = {
  1: HundeleineDunklesLeder,
  2: HundeleineRot,
  3: HundeleineStoff,
  4: HalsbandTuerkis,
  5: HalsbandLeder,
  6: HalsbandPremium,
  7: JackeBlau,
  8: Pulli,
  9: JackeSchwarz,
  10: Pedigree,
  11: ActivaGold,
  12: Nutrima,
  'default': DefaultImage
}

// 2. Produktdaten-Array (für ProductCarousel)
export const productCarouselData = [
  { 
    id: 1, 
    name: 'Premium Lederleine', 
    image: HundeleineDunklesLeder,
    category: 'leinen'
  },
  { 
    id: 2, 
    name: 'Stoffleine mit Griff', 
    image: HundeleineStoff,
    category: 'leinen'
  },
  { 
    id: 3, 
    name: 'Leine in Rot', 
    image: HundeleineRot,
    category: 'leinen'
  },
  { 
    id: 4, 
    name: 'Türkises Halsband', 
    image: HalsbandTuerkis,
    category: 'halsbaender'
  },
  { 
    id: 5, 
    name: 'Lederhalsband', 
    image: HalsbandLeder,
    category: 'halsbaender'
  },
  { 
    id: 6, 
    name: 'Premium Halsband', 
    image: HalsbandPremium,
    category: 'halsbaender'
  },
  { 
    id: 7, 
    name: 'Rote Regenjacke', 
    image: JackeBlau,
    category: 'bekleidung'
  },
  { 
    id: 8, 
    name: 'Kuscheliger Pullover', 
    image: Pulli,
    category: 'bekleidung'
  },
  { 
    id: 9, 
    name: 'Schwarze Regenjacke', 
    image: JackeSchwarz,
    category: 'bekleidung'
  },
  { 
    id: 10, 
    name: 'Pedigree Trockenfutter', 
    image: Pedigree,
    category: 'snacks'
  },
  { 
    id: 11, 
    name: 'Activa Gold Futter', 
    image: ActivaGold,
    category: 'snacks'
  },
  { 
    id: 12, 
    name: 'Nutrima Premiumfutter', 
    image: Nutrima,
    category: 'snacks'
  }
]

// 3. Hilfsfunktion
export function getProductImage(productId) {
  return productImages[productId] || productImages['default']
}