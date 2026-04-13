// Type definitions
export interface Partner {
  name: string;
  role: string;
  image: string;
  bio: string[];
}

export interface Team {
id: number;
role: string;
name: string;
image: string;
}

export interface JourneyPartner {
  name: string;
  title: string;
  image?: string; // Optional - only 4 will have images
}

export interface SignatureProject {
  title: string;
  image: string;
}

export interface TimelineMilestone {
  year: string;
  events: string[];
}

export const team: Team[] = [
  {
    id: 2,
    name: 'Ar. Athirah Yen',
    role: 'LAM AG/A 678, BSc. Arch (Hons) Taylor‘s, M. Arch UM, LAM/RIBA PART II',
    image: 'People/athirah.jpeg',
  },
  {
    id: 3,
    name: 'haziqah ngasri',
    role: 'Dipl. Fine Art, Bsc. Arch (Hons) UITM, LAM Part I',
    image: 'People/haziqah.jpeg',
  },
  {
    id: 4,
    name: 'Hester Chang',
    role: 'BSc. Arch (Hons) Taylor’s, LAM Part I',
    image: 'People/hester.jpeg',
  },
  {
    id: 5,
    name: 'shu herng',
    role: 'BA Arch. (Hons) ESALA, RIBA Part I',
    image: 'People/shu.jpeg',
  },
  {
    id: 6,
    name: 'brandon ngiau',
    role: 'Bsc. Arch (Hons) Taylor‘s, LAM Part I',
    image: 'People/brandon.jpeg',
  },
  {
    id: 7,
    name: 'REVATHY SIVA',
    role: 'B. Arch (Hons) UMK, LAM Part I',
    image: 'People/revathy.jpeg',
  },
  {
    id: 8,
    name: 'daphne wee',
    role: 'B Arch. (Hons) SEGi, LAM Part I',
    image: 'People/daphne.jpeg',
  },

  {
    id: 9,
    name: 'yusof hafiz',
    role: 'BSc. Arch (Hons), MSc. Applied Arch. & Design QUEENS, RIBA/ARB/LAM Part II',
    image: 'People/yusof.jpeg',
  },
  {
    id: 10,
    name: 'VIKTOR ZEIDLER LIM',
    role: 'BSc. Arch (Hons) Taylor’s, LAM Part I',
    image: 'People/viktor.jpeg',
  },

]

// Key Partners data
export const keyPartners: Partner[] = [
  {
      name: 'Huat LIM',
      role: ' Managing Director',
      image: 'People/huatsolo.jpeg',
      bio: [
          'Huat Lim studied at the Architectural Association in London from 1981 to 1984. He has been a member of the Architects Registration Board and the Royal Institute of British Architects since 1987. Among his tutors at the AA were Peter Cook, Christine Hawley, Peter Salter, Ron Herron, Rodrigo Pérez de Arce and Gordon Pask, probably his most influential mentor.',
          'Huat taught briefly at the Bartlett London, with Sir Peter Cook and David Dunster. Huat LIM has been employed to work on very large and complex buildings, a career spanning over 22 years, principally at Lord Foster London Stansted Airport, the Nimes Mediateque Museum, HKSB HQ at Canary Wharf, the Masterplan for King Cross Redevelopment, and later at Imagination Limited Jubilee Line Extension for London with the late Ron Herron of Archigram fame.',
          'In Asia, Huat worked on GDP Asia Broadcasting Centre and their NTV7 Radio and Television Studios. Huat was also engaged to work with design teams to win TRHYeang Singapore National Library Competition and LDY entry for the Xian International Airport Competition.',
      ],
  },
  {
      name: 'Susanne ZEIDLER',
      role: 'Executive Director',
      image: 'People/susannesolo.jpeg',
      bio: [
          'Susanne ZEIDLER hails from Frankfurt and studied art history before her postgraduate term at the Staedle Schule under the tutorship of Professor Peter COOK, and later at the Bartlett School of Architecture, London. Susanne moved to Malaysia in 1992, and now lives in Kuala Lumpur and is Executive Director and Senior Partner at zlgdesign.',
          'Her most significant contribution to zlgdesign is the BOH Visitor Centre which has since won wide public recognition. Susanne is no less of an architect than she is a designer, having delivered most of the interior design projects for the firm, namely the I-Zen, Puncak Dana and the MK Land Interiors and Show Unit designs.',
          'Her training in London after a stint in Germany at the Frankfurtschule under the tutorship of Sir Peter Cook of Archigram fame, has given her an interesting edge through her very broad but yet distinctive cultural style to her work at zlgdesign. Susanne was instrumental in the delivery of the BOH Visitor Centre.',
      ],
  },
];

export const companyTimeline: TimelineMilestone[] =[
  {
      year: '1981',
      events: [
        'Huat leaves for the Architectural Association (AA), London',
        'First introduction to the work of Christo and Jeanne-Claude, Running Fence, and Richard Long',
        'Huat visits Saint-Malo, Mont-Saint-Michel and Stonehenge with tutors Andrew Minchin and Athanasios Spanomaridis',
      ],
    },
    {
      year: '1982',
      events: [
        'Huat receives Royal Institute of British Architects, Part 1',
        'Huat wins the Intermediate School Prize at the Architectural Association',
      ],
    },
    {
      year: '1983',
      events: [
        'Huat travels to Málaga, Seville and Ronda and visits the Generalife summer palace in Granada',
        'Huat visits Maison de Verre (House of Glass), La Coupole, Villa La Roche, Paris',
      ],
    },
    {
      year: '1990',
      events: [
        'Huat meets the French architects Odile Decq and Benoit Cornette at the YMCA, London',
      ],
    },
    {
      year: '1991',
      events: [
        'Susanne‘s third year of postgraduate studies at the Bartlett School of Architecture with a one-year scholarship from the Evangelisches Studienwerk, Germany',
        'Huat works at Imagination Limited, London, and meets Gary Withers',
        'Huat works at Zaha Hadid Architects, London, on the Vitra Fire Station, Weil am Rhein, Germany',
      ],
    },
    {
      year: '1992',
      events: [
        'Huat and Susanne set up Zeidler&Lim Architects at Gloucester Avenue, Primrose Hill, London',
        'ZLGDesign enters the Glasgow Tower competition in collaboration with Chris Wise of Ove Arup',
      ],
    },
    {
      year: '1993',
      events: [
        'Huat and Susanne return to Malaysia',
        'Huat interviews with BBC Radio at the Petronas Twin Towers construction site, Kuala Lumpur',
      ],
    },
    {
      year: '1994',
      events: [
        'Huat and Susanne set up ZLGDesign in Kuala Lumpur',
        'ZLGDesign presents KL LinearCity master plan to the prime minister of Malaysia, Mahathir Mohamad',
        'Huat meets Peter Cook, Ron Herron and Tony Fitzpatrick to Kuala Lumpur to work on KL LinearCity',
      ],
    },
    {
      year: '1995',
      events: [
        'ZLGDesign completes design for Hotel Capitol, Kuala Lumpur',
      ],
    },
    {
      year: '1997',
      events: [
        'Huat works as project architect on the NTV7 broadcasting studio, Kuala Lumpur',
      ],
    },
    {
      year: '1999',
      events: [
        'Hotel Capitol wins the Malaysian Interior Design Award',
      ],
    },
    {
      year: '2001',
      events: [
        'Huat lectures at the second edition of the Transportable Environments Conference on portable architecture, organised by the National University of Singapore)',
      ],
    },
    {
      year: '2002',
      events: [
        'ZLGDesign renovates Duta Plaza which is renamed Avenue K, Kuala Lumpur',
        'Huat meets the interior designer and architect Christian Liaigre, the interior designer and president of Glamorous, Japan, Yasumichi Morita, and the interior designer Ann Li Koh of Perception Design, Hong Kong',
      ],
    },
    {
      year: '2003',
      events: [
        'Jurong Town Corporation Singapore appoints ZLGDesign for construction drawings, detail and design for Zaha Hadid’s Biopolis master plan, Singapore',
      ],
    },
    {
      year: '2004',
      events: [
        'Huat and Bernice Chauly lecture and present their work at the Architectural Association as part of the Asia@AA Lecture Symposium organised by Ken Yeang',
        'Huat meets Lei Fu and Kengo Kuma for a joint collaboration on Z58, Shanghai',
      ],
    },
    {
      year: '2005',
      events: [
        'ZLGDesign exhibits at the Lille (2004) and Cork (2005) European Capital of Culture exhibitions',
        'ZLGDesign completes the BOH Visitor Centre, Cameron Highlands',
      ],
    },
    {
      year: '2006',
      events: [
        'Avenue K and K Residence mixed development in Kuala Lumpur completes ZLGDesign collaborates with Anne Militello, Christian Liaigre, James Gibson of Denton Corker Marshall and Conran Design Group for Avenue K and K Residence, Kuala Lumpur',
      ],
    },
    {
      year: '2007',
      events: [
        'Huat and Susanne travel to Padua and meet with the Cappochin family',
      ],
    },
    {
      year: '2008',
      events: [
        'Huat lectures on ‘Durability’ at the Ong Siew May Distinguished Lectures Series on ‘Sustain/Ability’, National University of Singapore',
        'BOH Visitor Centre wins the Cityscape Asia Real Estate Awards, Singapore',
        'Huat joins Hani Rashid, Matthias Sauerbruch, Enrique Browne, Michel Langrand, Francis Nordeman and Eva Jiřičná at the International VELUX Award on the theme ’The Light of Tomorrow‘, Venice',
      ],
    },
    {
      year: '2009',
      events: [
        'Huat and Susanne set up ZLGEvents',
        'ZLGEvents invites Peter Cook to lecture at Kuala Lumpur Convention Centre',
        'Huat meets Thomas Heatherwick, Zaha Hadid, Terence Conran and David Adjaye in London',
      ],
    },
    {
      year: '2010',
      events: [
        'ZLGDesign wins contract to work on Avenue K refurbishment Phase 2, Kuala Lumpur, Malaysia',
      ],
    },
    {
      year: '2011',
      events: [
        'ZLGDesign starts work on Tepian Tunku residence, Kuala Lumpur, Malaysia',
      ],
    },
    {
      year: '2012',
      events: [
        'ZLGDesign moves to Bangunan Perdagangan D7, Jalan Sentul, Kuala Lumpur',
        'ZLGEvents organises Peter Cook and Gavin Robotham of CRAB Studio for a lecture at DoubleTree by Hilton, Kuala Lumpur',
        'ZLGEvents organises a children‘s art workshop with Syahidah Osman at D7, Kuala Lumpur',
      ],
    },
    {
      year: '2013',
      events: [
        'ZLGEvents organises Thomas Fagernes of Snøhetta to lecture at Kuala Lumpur Convention Centre',
        'ZLGDesign invites Nike Bätzner, Roland Stratmann, Lucien den Arend, Stephen Maas and Nina Freedman for the Nilai Memorial Arts Centre project master plan, Kuala Lumpur',
        'ZLGEvents collaborates with photographers Chuan Lim, Sanjit Das and Suzanne Lee, writer Bernice Chauly, and artists Hayati Mokhtar and Ian Davies for the ‘Live through Many Lenses’ event at D7, Kuala Lumpur',
      ],
    },
    {
      year: '2014',
      events: [
        'Huat and Susanne visit Susanne Isa and Simon Herron, London',
        'ZLGEvents brings Susanne Isa and Simon Herron of the University of Greenwich for their lecture ’I’m Not A Dinosaur‘ at D7, Kuala Lumpur',
        'ZLGEvents brings Ken Shuttleworth (MAKE architects) for his lecture at Kuala Lumpur Convention Centre',
      ],
    },
    {
      year: '2015',
      events: [
        'ZLGEvents organises ’The Fantastic World of M.C. Escher: Film Screening and Readings‘ with Priscilla Ho, Helan Pereira and Arisha Akhir, Kuala Lumpur',
        'Art Fest: ’Voice of the Heart‘ discourse and readings with the artist Elena Kravchenko, D7 Studio, Kuala Lumpur',
        'Thomas Fagernes of Snøhetta visits ZLGDesign, Kuala Lumpur',
        'Lantern Hotel opens to the public in Chinatown, Kuala Lumpur',
      ],
    },
    {
      year: '2016',
      events: [
        'ZLGDesign completes Phoebe House, Bukit Tunku, Kuala Lumpur',
        'ZLGEvents hosts Janet Lee music performance at D7, Kuala Lumpur for a jazz musical',
      ],
    },
    {
      year: '2017',
      events: [
        'ZLGDesign works on BOH Visitor Centre second phase, Cameron Highlands',
        'ZLGDesign organises a lecture by Florentine Sack and Open House 2: Design Criteria for a New Architecture book launch at D7, Kuala Lumpur Huat and Susanne visit Florentine at the Blue House, Heiligenhafen, Germany',
        'Viktor designs the bottle brush tree insignia for the house at Wangsa Ukay and the publishing company Zeidler&Lim',
      ],
    },
    {
      year: '2018',
      events: [
        'Susanne accepts the AIT German Award for Lantern Hotel in Frankfurt',
        'ZLGDesign starts work on Sierramas residence, Kuala Lumpur',
        'Huat and family visit Christo and Jeanne-Claude‘s The London Mastaba installation on the River Thames and at the Serpentine Gallery, London',
      ],
    },
    {
      year: '2019',
      events: [
        'Huat and Susanne visit the farmhouse at Le Maine Bas',
        'Huat and Susanne visit Le Couvent Sainte-Marie de La Tourette, Éveux, France',
        'Huat and Susanne visit Hof Gimbach, near Frankfurt',
        'Huat and Susanne attend the Golden Pin Design Award Forum in Taiwan, meeting with the interior designer Tony Chi of tonychi studios, New York',
      ],
    },
    {
      year: '2020',
      events: [
        'Huat and Susanne complete the manuscript for the biographical essays in Ethos',
      ],
    },
    {
      year: '2021',
      events: [
        'Huat teaches design theory at UCSI University, Kuala Lumpur',
      ],
    },
    {
      year: '2022',
      events: [
        'ZLGDesign presents ‘Point92: Architecture of Resilience’ for Zak World of Façades Conference, Kuala Lumpur',
        'Suburbia and Zeidler&Lim Publishing publish Automatism (edited by Gareth Richards and Eryn Tan)',
        'Huat meets with the artist Jonathan C. Vaultman at his studio, Kuala Lumpur',
        'SC Shekar shares his book Grit & Grace: The Grandeur of Monochrome Malaysia and work philosophy at ZLGDesign Studio',
        'Huat and Susanne meet Bettina Chua Abdullah at the launch of her book To Nourish with Love, Hikayat, Penang',
        'Huat meets Gareth Richards at his Gerakbudaya Bookshop located in the Hikayat arts space, Penang',
      ],
    },
]


// Partners along the journey data - 4 with images, rest text-only
export const journeyPartners: JourneyPartner[] = [
  { name: 'sc shekar', title: 'photographer', image: '/general/partners/scshekar_solo.avif' },
  { name: 'gareth richards', title: 'editor, copyrighter, public speaker', image: '/general/partners/gareth_solo_1.avif' },
  { name: 'ar. dr. mastor bin surat', title: 'architect', image:'/general/partners/mastor_solo.avif'},
  { name: 'zora gabrovsek', title: 'gallerist, film producer', image:'/general/partners/zora_solo.avif' },
  { name: 'nike baetzner', title: 'researcher, art historian',image:'/general/partners/nike_solo.avif' },
  { name: 'naadiya and ashran bahari', title: 'suburbia books, publisher', image:'/general/partners/surburia_duo.avif' },
  { name: 'justus pysall', title: 'architect' },
  { name: 'zeidler&lim', title: 'publisher, foundation' },
  { name: 'renny booth', title: 'architect' },
  { name: 'viktor zeidler', title: 'graphic designer' },
  { name: 'brandon chee', title: 'ecologist' },
  { name: 'the one academy', title: '' },
  { name: 'taylors university', title: '' },
  { name: 'damien yow', title: 'entrepreneur, civil engineer' },
];
