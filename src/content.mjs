export const SITE = 'https://sparkparking.gr';
export const CONTACT_EMAIL = 'sales@sparkparking.gr';

export const LOCALES = {
  el: {
    code: 'el',
    label: 'Ελληνικά',
    short: 'ΕΛ',
    path: '/',
    dir: '',
    fonts: ['manrope-latin.woff2', 'manrope-greek.woff2'],
    meta: {
      title: 'sPark — Σύγκρινε τιμές πάρκινγκ σε έναν ζωντανό χάρτη',
      description:
        'Ένας ζωντανός χάρτης για κάθε θέση πάρκινγκ στην πόλη. Σύγκρινε τιμές και διαθεσιμότητα σε δευτερόλεπτα, ή διαχειρίσου το δικό σου πάρκινγκ.',
      ogDescription:
        'Ζωντανές τιμές και διαθεσιμότητα για κάθε θέση πάρκινγκ στην πόλη — για οδηγούς και για όσους τις διαχειρίζονται.',
      imageAlt: 'Λογότυπο sPark',
      siteDescription: 'Ένας ζωντανός χάρτης για κάθε θέση πάρκινγκ στην πόλη.',
      appDescription: 'Βρες και σύγκρινε τιμές και διαθεσιμότητα πάρκινγκ σε έναν ζωντανό χάρτη.',
    },
    nav: { drivers: 'Για οδηγούς', business: 'Για επιχειρήσεις' },
    audience: { drivers: 'Για οδηγούς', business: 'Για επιχειρήσεις', label: 'Επιλογή κοινού' },
    themeToggle: 'Εναλλαγή θέματος',
    langLabel: 'Γλώσσα',
    drivers: {
      eyebrow: 'Για οδηγούς · εφαρμογή για κινητό',
      headline: 'Βρες το φθηνότερο πάρκινγκ, ακριβώς εκεί που πας.',
      sub: 'Δες κάθε χώρο στάθμευσης σε έναν ζωντανό χάρτη, σύγκρινε τιμές σε δευτερόλεπτα και φίλτραρε ακριβώς ό,τι χρειάζεσαι. Τέλος οι βόλτες γύρω από το τετράγωνο.',
      cta1: 'Μπες στη λίστα αναμονής',
      cta2: 'Δες πώς λειτουργεί',
      chips: ['Δωρεάν χρήση', 'Τιμές σε πραγματικό χρόνο', 'Χωρίς εγγραφή για περιήγηση'],
      stepsEyebrow: 'Πώς λειτουργεί',
      stepsTitle: 'Πάρκινγκ σε τρία μόνο βήματα.',
      steps: [
        {
          n: '01',
          t: 'Βάλε πινέζα',
          d: 'Αναζήτησε προορισμό ή μετακίνησε τον χάρτη — το sPark εμφανίζει κάθε χώρο στάθμευσης στην περιοχή.',
        },
        {
          n: '02',
          t: 'Σύγκρινε τιμές',
          d: 'Εγκαταστάσεις ταξινομημένες κατά τιμή ή απόσταση. Διάλεξε όχημα και διάρκεια για δεις το ακριβές σύνολο.'
        },
        {
          n: '03',
          t: 'Πάρκαρε και φύγε',
          d: 'Διάλεξε θέση, πλοηγήσου στην είσοδο και δες τη διαθεσιμότητα πριν φτάσεις.',
        },
      ],
      featEyebrow: 'Γιατί sPark',
      featTitle: 'Σύγκρινε πριν δεσμευτείς.',
      featSub: 'Ό,τι χρειάζεσαι για να διαλέξεις τη σωστή θέση στη σωστή τιμή — με ένα άγγιγμα.',
      features: [
        {
          t: 'Ταξινόμηση κατά τιμή ή απόσταση',
          d: 'Κατάταξε κάθε κοντινό χώρο στάθμευσης κατά τιμή ή απόσταση με ένα άγγιγμα.',
        },
        {
          t: 'Τιμή για τη δική σου στάθμευση',
          d: 'Όρισε άφιξη και αναχώρηση για το πραγματικό σύνολο — αυτοκίνητο, μηχανή, βαν ή φορτηγό.',
        },
        {
          t: 'Διαθεσιμότητα σε πραγματικό χρόνο',
          d: 'Δες τι είναι Ελεύθερο ή Πλήρες πριν ξεκινήσεις.',
        },
        { t: 'Διαθεσιμότητα σε πραγματικό χρόνο', d: 'Δες τις εγκαταστάσεις με διαθεσιμότητα σε πραγματικό χρόνο.' },
        {
          t: 'Παροχές που μετρούν',
          d: 'Φίλτραρε με βάση τις παροχές που σε ενδιαφέρουν, για να βρείς την ιδανική θέση.'
        }
      ],
      ctaHead: 'Έτοιμος να σταματήσεις να πληρώνεις παραπάνω για πάρκινγκ;',
      ctaSub: 'Μπες στη λίστα αναμονής και θα σε ειδοποιήσουμε μόλις το sPark έρθει στην πόλη σου.',
      mailSubject: 'sPark — λίστα αναμονής',
    },
    business: {
      eyebrow: 'Για επιχειρήσεις · πίνακας ελέγχου',
      headline: 'Γέμισε κάθε θέση. Έλεγξε τις τιμές σου σε πραγματικό χρόνο.',
      sub: 'Το sPark φέρνει το πάρκινγκ σου μπροστά στους οδηγούς τη στιγμή που ψάχνουν. Διαχειρίσου τιμολόγια, ώρες, ζώνες και χωρητικότητα από έναν πίνακα ελέγχου.',
      cta1: 'Κλείσε παρουσίαση',
      cta2: 'Δες πώς λειτουργεί',
      chips: ['Χωρίς κόστος εγκατάστασης', 'Ενεργοποίηση σε μία μέρα', 'Ακύρωση όποτε θες'],
      stepsEyebrow: 'Πώς λειτουργεί',
      stepsTitle: 'Ο χώρος σου ζωντανός σε τρία βήματα.',
      steps: [
        {
          n: '01',
          t: 'Όρισε τα τιμολόγιά σου',
          d: 'Καθόρισε ωριαία, ημερήσια και δυναμική τιμολόγηση — και άλλαξέ τη όποτε αλλάζει η ζήτηση.',
        },
        {
          n: '02',
          t: 'Χαρτογράφησε τους χώρους σου',
          d: 'Σχεδίασε ενεργές ζώνες, όρισε ώρες λειτουργίας και δήλωσε πόσες θέσεις έχει κάθε σημείο.',
        },
        {
          n: '03',
          t: 'Παρακολούθησε τη ζήτηση',
          d: 'Δες πληρότητα, προβολές και έσοδα να ενημερώνονται ζωντανά καθώς σε ανακαλύπτουν οδηγοί.',
        },
      ],
      featEyebrow: 'Ο πίνακας ελέγχου',
      featTitle: 'Τα πάντα σε ένα κέντρο ελέγχου.',
      featSub: 'Διαχειρίσου τιμές, χωρητικότητα και απόδοση σε κάθε σημείο που λειτουργείς.',
      features: [
        {
          t: 'Δυναμική τιμολόγηση',
          d: 'Προσαρμόστε τους κανόνες τιμολόγησης αυτόματα για την άμεση ανταπόκριση στη ζήτηση.'
        },
        {
          t: 'Πληρότητα σε πραγματικό χρόνο',
          d: 'Ενημέρωσε τις ελεύθερες θέσεις σε πραγματικό χρόνο και παρακολούθησε τις κρατήσεις σου σε πραγματικό χρόνο.'
        },
        {
          t: 'Ζώνες και ώρες',
          d: 'Πολλαπλά σημεία, το καθένα με τις δικές του ενεργές ζώνες και ώρες λειτουργίας.',
        },
        { t: 'Ανάλυση εσόδων', d: 'Δες προβολές, μετατροπές και έσοδα ανά σημείο με μια ματιά.' },
      ],
      ctaHead: 'Μετάτρεψε τις κενές θέσεις σε έσοδα.',
      ctaSub: 'Κλείσε μια παρουσίαση 20 λεπτών και δες την επιχείρησή σου ζωντανά στον χάρτη του sPark.',
      mailSubject: 'sPark — αίτημα παρουσίασης'
    },
    footer: {
      tag: 'Κάνε το παρκάρισμα έξυπνο.',
      desc: 'Ένας χάρτης για κάθε θέση πάρκινγκ στην πόλη — με ζωντανές τιμές για τους οδηγούς και πλήρη έλεγχο για τους διαχειριστές.',
      driversTitle: 'Οδηγοί',
      driversLinks: ['Μπες στη λίστα αναμονής', 'Πώς λειτουργεί', 'Δυνατότητες'],
      businessTitle: 'Επιχειρήσεις',
      businessLinks: ['Πώς λειτουργεί', 'Κλείσε παρουσίαση'],
      contactTitle: 'Επικοινωνία',
      contactNote: 'Οδηγοί και επιχειρήσεις — στείλτε μας email και θα σου απαντήσουμε άμεσα.',
      generalSubject: 'sPark — γενική επικοινωνία',
      rights: '© 2026 sPark. Με επιφύλαξη παντός δικαιώματος.',
      place: 'Θεσσαλονίκη · Για εξυπνότερες πόλεις'
    },
    phone: {
      areas: '4 χώροι στάθμευσης',
      swipe: 'Σύρε για λίστα',
      nearby: 'Κοντά',
      cheapest: 'Φθηνότερα',
      total: 'σύνολο',
      available: 'Ελεύθερο',
      spotA: 'Πλατεία Αριστοτέλους',
      spotASub: 'Aristotelous Square',
      spotB: 'Υπαίθριο πάρκινγκ',
      spotBSub: 'Εγνατία',
    },
    dash: {
      nav: [
        'Επισκόπηση',
        'Χώροι',
        'Τιμολόγια',
        'Κρατήσεις',
        'Διαχειριστές',
        'Αναλύσεις',
        'Αρχείο ενεργειών',
      ],
      title: 'Πίνακας ελέγχου',
      overview: 'Επισκόπηση',
      snapshot: 'Μια εικόνα των λειτουργιών στάθμευσης.',
      facilities: 'Χώροι',
      bookings: 'Ενεργές κρατήσεις',
      revenue: 'Έσοδα σήμερα',
      chart: 'Έσοδα · τελευταίες 7 ημέρες',
      userName: 'Υπερδιαχειριστής πλατφόρμας',
      userRole: 'Διαχειριστής πλατφόρμας',
    },
  },

  en: {
    code: 'en',
    label: 'English',
    short: 'EN',
    path: '/en/',
    dir: 'en',
    fonts: ['manrope-latin.woff2', 'sora-latin.woff2'],
    meta: {
      title: 'sPark — Compare Parking Prices on One Live Map',
      description:
        'One live map for every parking spot in the city. Drivers compare prices and availability in seconds; operators control tariffs, zones and capacity in real time.',
      ogDescription:
        'Live prices and availability for every parking spot in the city — for drivers and for the operators who run them.',
      imageAlt: 'sPark logo',
      siteDescription: 'One live map for every parking spot in the city.',
      appDescription: 'Find and compare parking prices and availability on one live map.',
    },
    nav: { drivers: 'For drivers', business: 'For businesses' },
    audience: { drivers: 'For drivers', business: 'For businesses', label: 'Choose audience' },
    themeToggle: 'Toggle color theme',
    langLabel: 'Language',
    drivers: {
      eyebrow: 'For drivers · mobile app',
      headline: 'Find the cheapest parking, right where you’re headed.',
      sub: 'See every parking area on one live map, compare prices in seconds, and filter by exactly what you need. No more circling the block.',
      cta1: 'Join the waitlist',
      cta2: 'See how it works',
      chips: ['Free to use', 'Real-time prices', 'No sign-up to browse'],
      stepsEyebrow: 'How it works',
      stepsTitle: 'Parking sorted in three taps.',
      steps: [
        {
          n: '01',
          t: 'Drop a pin',
          d: 'Search a destination or move the map — sPark surfaces every parking area in view.',
        },
        {
          n: '02',
          t: 'Compare prices',
          d: 'Live tariffs ranked cheapest or nearest. Pick your vehicle and stay to see an exact total.',
        },
        {
          n: '03',
          t: 'Park & go',
          d: 'Pick your spot, navigate to the entrance, and check real-time availability before you arrive.',
        },
      ],
      featEyebrow: 'Why sPark',
      featTitle: 'Compare before you commit.',
      featSub: 'Everything you need to choose the right spot at the right price — in one tap.',
      features: [
        {
          t: 'Sort by cheapest or nearest',
          d: 'Rank every nearby parking area by price or distance in one tap.',
        },
        {
          t: 'Price for your exact stay',
          d: 'Set arrival and departure for the real total — car, motorbike, van or truck.',
        },
        { t: 'Real-time availability', d: 'See what’s Available or Full before you drive over.' },
        {
          t: 'Amenities that matter',
          d: 'Filter for CCTV, covered and disabled spaces — with free cancellation.',
        },
      ],
      ctaHead: 'Ready to stop overpaying for parking?',
      ctaSub: 'Join the waitlist and we’ll tell you the moment sPark lands in your city.',
      mailSubject: 'sPark waitlist — notify me at launch',
    },
    business: {
      eyebrow: 'For businesses · web dashboard',
      headline: 'Fill every spot. Control your pricing in real time.',
      sub: 'sPark puts your parking in front of drivers the moment they’re searching. Manage tariffs, hours, zones and capacity from one dashboard.',
      cta1: 'Book a demo',
      cta2: 'Talk to sales',
      chips: ['No setup fee', 'Go live in a day', 'Cancel anytime'],
      stepsEyebrow: 'How it works',
      stepsTitle: 'Your lot, live in three steps.',
      steps: [
        {
          n: '01',
          t: 'Set your tariffs',
          d: 'Define hourly, daily and dynamic pricing — and change it anytime the market shifts.',
        },
        {
          n: '02',
          t: 'Map your areas',
          d: 'Draw active zones, set operating hours and list exactly how many spots each site has.',
        },
        {
          n: '03',
          t: 'Track demand',
          d: 'Watch occupancy, views and revenue update live as drivers discover you.',
        },
      ],
      featEyebrow: 'The dashboard',
      featTitle: 'Everything in one control room.',
      featSub: 'Run pricing, capacity and performance across every location you operate.',
      features: [
        { t: 'Dynamic pricing', d: 'Peak, off-peak and event rules that adjust rates automatically.' },
        { t: 'Real-time occupancy', d: 'Update free spots in real time or sync straight from your gate system.' },
        { t: 'Zones & hours', d: 'Multiple sites, each with its own active areas and operating hours.' },
        { t: 'Revenue analytics', d: 'See views, conversion and earnings per location at a glance.' }
      ],
      ctaHead: 'Turn empty spots into revenue.',
      ctaSub: 'Book a 20-minute demo and see your lot live on the sPark map.',
      mailSubject: 'sPark demo request',
    },
    footer: {
      tag: 'Make Parking Smart.',
      desc: 'One map for every parking spot in the city — with live prices for drivers and full control for operators.',
      driversTitle: 'Drivers',
      driversLinks: ['Join the waitlist', 'How it works', 'Features'],
      businessTitle: 'Businesses',
      businessLinks: ['How it works', 'Book a demo'],
      contactTitle: 'Contact',
      contactNote: 'Whether you’re a driver or run a business, drop us an email — a real person will get back to you, not a bot.',
      generalSubject: 'sPark — general enquiry',
      rights: '© 2026 sPark. All rights reserved.',
      place: 'Athens · Made for smarter cities',
    },
    phone: {
      areas: '4 parking areas',
      swipe: 'Swipe for list',
      nearby: 'Nearby',
      cheapest: 'Cheapest',
      total: 'total',
      available: 'Available',
      spotA: 'Aristotelous Square',
      spotASub: 'Πλατεία Αριστοτέλους',
      spotB: 'Surface parking',
      spotBSub: 'Egnatia',
    },
    dash: {
      nav: ['Overview', 'Facilities', 'Tariffs', 'Bookings', 'Operators', 'Analytics', 'Audit log'],
      title: 'Dashboard',
      overview: 'Overview',
      snapshot: 'A snapshot of your parking operations.',
      facilities: 'Facilities',
      bookings: 'Active bookings',
      revenue: 'Revenue today',
      chart: 'Revenue · last 7 days',
      userName: 'Platform Super Admin',
      userRole: 'Platform admin',
    },
  },
}

export const LOCALE_CODES = Object.keys(LOCALES)
export const DEFAULT_LOCALE = 'el'
