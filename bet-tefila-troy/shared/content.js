window.BET_TEFILA_CONTENT = {
  name: 'Beth Tephila Synagogue',
  displayName: 'Beth Tephila Synagogue',
  shortName: 'Beth Tephila',
  hebrewMeaning: 'House of Prayer',
  address: '82 River Street, Troy, NY 12180',
  phone: '(518) 272-3182',
  email: 'office@bethtephilahtroy.org',
  facebook: 'https://www.facebook.com/bethtephilah.synagogue/',
  tour360: 'https://synagogues-360.anumuseum.org.il/gallery/beth-tephilah/',
  nav: [
    { href: 'index.html', label: 'Home' },
    { href: 'events.html', label: 'Events' },
    { href: 'event-registration.html', label: 'Plan a Simcha' },
    { href: 'contact.html', label: 'Contact' },
    { href: 'donate.html', label: 'Donate' }
  ],
  facts: [
    'Beth Tephila means House of Prayer',
    'Historic synagogue overlooking the Hudson River',
    'Original congregation established in 1850',
    'River Street synagogue building constructed in 1909',
    'Located in Troy’s Central Historic District',
    'Placed on the National Register of Historic Places in May 2016',
    'Neo-Classical exterior with Doric columns and a copper dome',
    'Barrel-vaulted sanctuary with a women’s balcony supported by Doric columns',
    'Orthodox / Chabad Jewish life in downtown Troy',
    'Call ahead for Shabbat minyan, kosher meals, community visits, and traveler logistics'
  ],
  historyHighlights: [
    {
      year: '1850',
      title: 'Congregation roots',
      text: 'The original Beth Tephila congregation was established in Troy when the local Jewish community was growing.'
    },
    {
      year: '1909',
      title: 'River Street building',
      text: 'The grand synagogue building was constructed overlooking the Hudson River, with a monumental entry, dome, and sanctuary volume.'
    },
    {
      year: '2016',
      title: 'National Register',
      text: 'Beth Tephila was placed on the National Register of Historic Places in May 2016 as part of Troy’s historic fabric.'
    },
    {
      year: 'Today',
      title: 'Alive and welcoming',
      text: 'Prayer, Shabbat hospitality, kosher meals, holiday tables, students, travelers, and heritage visits keep the building active.'
    }
  ],
  architecture: [
    'Neo-Classical design',
    'Towering entry section',
    'Fine copper dome',
    'Horizontal sanctuary section',
    'Doric columns',
    'Longitudinal barrel-vaulted sanctuary ceiling',
    'Women’s balcony'
  ],
  minyanSchedule: [
    { day: 'Sunday', short: 'Sun', dayIndex: 0,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '9:00 AM' },
        { id: 'mincha', name: 'Mincha', time: '7:30 PM' },
        { id: 'maariv', name: 'Maariv', time: '8:15 PM' }
      ]
    },
    { day: 'Monday', short: 'Mon', dayIndex: 1,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '7:00 AM' },
        { id: 'mincha', name: 'Mincha–Maariv', time: '7:30 PM' }
      ]
    },
    { day: 'Tuesday', short: 'Tue', dayIndex: 2,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '7:00 AM' },
        { id: 'mincha', name: 'Mincha–Maariv', time: '7:30 PM' }
      ]
    },
    { day: 'Wednesday', short: 'Wed', dayIndex: 3,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '7:00 AM' },
        { id: 'mincha', name: 'Mincha–Maariv', time: '7:30 PM' }
      ]
    },
    { day: 'Thursday', short: 'Thu', dayIndex: 4,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '7:00 AM' },
        { id: 'mincha', name: 'Mincha–Maariv', time: '7:30 PM' }
      ]
    },
    { day: 'Friday', short: 'Fri', dayIndex: 5, isFriday: true,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '7:00 AM' },
        { id: 'mincha', name: 'Mincha / Kabbalat Shabbat', time: 'Call for time' }
      ]
    },
    { day: 'Shabbat', short: 'Shab', dayIndex: 6, isShabbat: true,
      services: [
        { id: 'shacharit', name: 'Shacharit', time: '9:30 AM' },
        { id: 'musaf', name: 'Musaf', time: 'Follows Shacharit' },
        { id: 'mincha', name: 'Mincha', time: 'Call for time' },
        { id: 'maariv', name: 'Maariv / Havdalah', time: 'After Shabbat ends' }
      ]
    }
  ],
  simchaTypes: [
    { id: 'bar-mitzvah', label: 'Bar Mitzvah', icon: '✡', description: 'A sacred Torah milestone in an historic sanctuary.' },
    { id: 'bat-mitzvah', label: 'Bat Mitzvah', icon: '✡', description: 'Celebrate the milestone with family and community.' },
    { id: 'wedding', label: 'Wedding / Aufruf', icon: '💍', description: 'Chuppah, Aufruf, or Sheva Brachot at Beth Tephilah.' },
    { id: 'brit-milah', label: 'Brit Milah', icon: '🕊', description: 'Welcome a new son into the covenant of Israel.' },
    { id: 'upsherin', label: 'Upsherin', icon: '✂️', description: 'A first haircut celebrated with blessings and joy.' },
    { id: 'fiancailles', label: 'Fiançailles', icon: '💎', description: 'An engagement celebration and l\'chaim gathering.' },
    { id: 'heritage-tour', label: 'Heritage Tour', icon: '🏛', description: 'Private tours of the landmark 1909 synagogue.' },
    { id: 'shabbat-event', label: 'Shabbat Event', icon: '🕯', description: 'Shabbat dinner, study, or guest experience.' },
    { id: 'other', label: 'Other Gathering', icon: '★', description: 'Yahrzeit, memorial, family gathering, or custom event.' }
  ],
  upcomingEvents: [
    { id: 'shabbat', title: 'Shabbat Services & Meal', dateDisplay: 'Every Friday–Saturday', tag: 'Weekly', description: 'Join us for Kabbalat Shabbat, morning services, and a warm Shabbat meal. RSVP required for meals.', rsvpRequired: true },
    { id: 'rosh-hashana', title: 'Rosh Hashana Services', dateDisplay: 'September 2026', tag: 'High Holiday', description: 'Usher in the New Year 5787 with shofar, tefillah, and community. Seating by registration.', rsvpRequired: true },
    { id: 'yom-kippur', title: 'Yom Kippur — Kol Nidre', dateDisplay: 'September 2026', tag: 'High Holiday', description: 'Kol Nidre and Yom Kippur services in the historic sanctuary. Fasting and reflection together.', rsvpRequired: true },
    { id: 'sukkot', title: 'Sukkot Celebration', dateDisplay: 'October 2026', tag: 'Holiday', description: 'Shake the four species and celebrate in the sukkah. Family-friendly and festive.', rsvpRequired: false },
    { id: 'chanukah', title: 'Chanukah Candle Lighting', dateDisplay: 'December 2026', tag: 'Holiday', description: 'Public menorah lighting and celebration on River Street. All welcome.', rsvpRequired: false },
    { id: 'purim', title: 'Purim Celebration', dateDisplay: 'March 2027', tag: 'Holiday', description: 'Megillah reading, costumes, and festive gathering for all ages.', rsvpRequired: false },
    { id: 'passover', title: 'Passover Seder', dateDisplay: 'April 2027', tag: 'Holiday', description: 'Community Seder with kosher meal and Haggadah. Seats are limited — RSVP early.', rsvpRequired: true }
  ],
  events: [
    {
      id: 'shabbat-calendar',
      title: 'Shabbat Minyan & Kosher Meal',
      tag: 'Weekly / confirm',
      date: 'Shabbat by RSVP / call ahead',
      description: 'Warm tefillah, a kosher meal, conversation, and a place to land when you are in Troy for school, work, family, or travel.'
    },
    {
      id: 'holiday-table',
      title: 'Holiday Table & Community Dinner',
      tag: 'Holiday calendar',
      date: 'Seasonal Jewish holidays',
      description: 'Sedars, festival meals, candle-lighting gatherings, music, stories, and room for guests, families, students, and travelers.'
    },
    {
      id: 'bar-bat-mitzvah',
      title: 'Bar / Bat Mitzvah at Beth Tephila',
      tag: 'Coming of age',
      date: 'By family planning',
      description: 'A sacred milestone with Torah, family seating, kosher meal planning, and a warm historic atmosphere.'
    },
    {
      id: 'engagement-vort-lchaim',
      title: 'Engagement / Vort / L’Chaim',
      tag: 'Engagement',
      date: 'By appointment',
      description: 'Gather close family and friends for a warm l’chaim, vort, or engagement moment with kosher refreshments and community dignity.'
    },
    {
      id: 'brit-milah',
      title: 'Brit Milah / Bris',
      tag: 'New life',
      date: 'By family timing',
      description: 'Coordinate a circumcision gathering with care for timing, family needs, kosher refreshments, and a calm place for guests.'
    },
    {
      id: 'upsherin-chalakah',
      title: 'Upsherin / Chalakah First Haircut',
      tag: 'First haircut',
      date: 'By family planning',
      description: 'Mark a child’s first haircut with family, blessings, treats, photos, and a Jewish space that feels meaningful rather than generic.'
    },
    {
      id: 'heritage-tour',
      title: 'Historic Synagogue Visit',
      tag: 'History alive',
      date: 'By appointment',
      description: 'See the dome, balcony, barrel-vaulted sanctuary, and River Street story while learning how this landmark still serves Jewish life today.'
    },
    {
      id: 'student-minyan',
      title: 'Student Minyan & Torah Night',
      tag: 'Near campus',
      date: 'Weeknight pop-ups',
      description: 'A focused minyan and learning night for RPI-area students and young professionals near downtown Troy.'
    },
    {
      id: 'holiday-table',
      title: 'Holiday Table & Community Dinner',
      tag: 'Kosher food',
      date: 'Holiday calendar',
      description: 'Seasonal Jewish holiday programs, seders, festival meals, stories, and room for guests, families, students, and travelers.'
    }
  ]
};
