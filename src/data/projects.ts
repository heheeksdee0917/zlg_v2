export interface Project {
  id: string;
  slug: string;
  title: string;
  year: number;
  location: string;
  detailContent?: Array<{
    type: string;
    heading?: string;
    content: string;
  }>;
  heroImage: string;
  images: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'tepian-tunku',
    title: 'tepian tunku',
    year: 2015,
    location: 'kuala lumpur',
    detailContent: [
      {
        type: 'text',
        content: 'The main criteria for the spatial arrangement, aside from meeting the clients’ requirements, was to minimize cut and fill on the site and given its shape, we designed a very long rectangular building, allowing everyone an uninterrupted view of the garden and the sunset.'
      },
      {
        type: 'text',
        content: 'From the road, you enter the heart of the house, where the kitchen opens up to the dining and living areas, all surrounded by a terrace. This central space is where the owners spend most of their time; living, eating, and interacting together.'
      },
      {
        type: 'text',
        content: 'Private bedrooms are located above, while below, entertainment, play, and sports areas are nestled, surrounded by a lush garden.'
      },
    ],
    heroImage: '/projects/tepian-tunku/A4.avif',
    images: [
      '/projects/tepian-tunku/A4.avif',
      '/projects/tepian-tunku/A3.avif',
      '/projects/tepian-tunku/A2.avif',
      '/projects/tepian-tunku/A1.avif',
      '/projects/tepian-tunku/A5.avif',
      '/projects/tepian-tunku/A6.avif',
    ],
  },
  {
    id: '2',
    slug: 'point-92',
    title: 'point92',
    year: 2012,
    location: 'Damansara Perdana',
    detailContent: [
      {
        type: 'text',
        content: 'Point92 will be seeing some rock blasting activities finally – a very long awaited moment has come to pass. The iconic facade will now be designed to enhance the block much of which will be precast concrete panels arranged in random fashion with a much reduced glazed area to cut back on energy costs. Simply named after the size of the site itself, this formidable building perches on a sloped site, overlooking Damansara Perdana and its ribbons of roads.'
      },
      {
        type: 'text',
        content: 'The punctuated façade is similar to all of zlgdesign\'s works and that is not to say that the appeal is lost.In fact, the play of ambience through the incorporation of day lighting with façade treatment is a tried and true timeless aesthetic, as are the impeccable play of materials the architects are known for.' 
      },
      {
        type: 'text',
        content: '"Although the brief called for office development, we had this idea that much of the work place products that are available today had not played creatively on issues the likes of day lighting, ambience and materiality of the façade," says Huat Lim, Managing Director of zlgdesign. "Instead, nearly all office developments emphasise efficiency and maximum density as overriding concerns and aims over design and aesthetics , let alone their simple functionality in terms of critical ambience and spatial plan."'
      },
      {
        type: 'text',
        content: 'Staying true to their intention of creating an ambience that includes the context to the inside of the building, visitors will get to experience a breathtaking view of Damansara Perdana as they arrive at the lobby through a slowly rising escalating step way above the drop off. The arrival deck allows visitors to drink in the view by providing randomly placed precast concrete benches that encourages respite while wooden lanterns with marine plywood ceilings buttoned tightly against a raw concrete under croft creates a soothing canopy.'
      },
      {
        type: 'text',
        content: 'The reception desk with a pandomo recessed and undulating rebated wall greets the visitor and reminds them of the graphics and geometry of the building\'s façade walls. "As an office plan, the generating feature of the floor plate is in fact a cut-out space which comprises of several levels of voids connected through gardens and meshes of vertical planting. The centre support column is braced to either side with different thickness of beams each corresponding to different floor forces framing the vertical space that is the garden," explains Huat Lim.There is also a special screen that rises several levels in the façade and made of layers of greenery supported on a series of steel wire ropes pulled between the floors.' 
      },
      {
        type: 'text',
        content: 'The terraces beyond the screen is specially lit and designed grandly to give the viewers from outside a peep into the garden, adding an ethereal touch of a floating mysterious garden within a floating building by the hillside.'
      },
      {
        type: 'text',
        content: 'To overcome the problem of building on a slope, the design opted for Lafarge cement to create an in situ concrete wall instead of the usual precast concrete solutions.'
      },
      {
        type: 'text',
        content: '"Not only was it necessary to use metal formwork in sets to meet with a target schedule, we were also informed of the uniformity issues if the façade was casted in regular sequences. Hence the randomly casted sequence." Huat Lim adds. To give better moment connections and easy casting as well as minimise bulging and honey-combing of the surface concrete, part of the floor slabs had to be casted together with the wall elements.'
      },
      {
        type: 'text',
        content: 'Elegantly rising from the slopes, the slanting walls in the façade continues the natural geometry of the site while the rectangular punctuations complement the ever developing built environment in Damansara Perdana. Light permeating through the punctured façade promises a soothing and safe ambience, highlighted further by the backing hills as well as the warm and raw colours of the chosen materials and finishes. There is no denying that this is a much anticipated addition to the trendy workplaces that seem to centralise upon this hilly area.'
      },
    ],
    heroImage: '/projects/point92/A1.avif',
    images: [
      '/projects/point92/A1.avif',
      '/projects/point92/A2.avif',
      '/projects/point92/A3.avif',
      '/projects/point92/A4.avif',
      '/projects/point92/A5.avif',
      '/projects/point92/A6.avif',
    ],
  },
  {
    id: '3',
    slug: 'boh-visitor-centre',
    title: 'Boh Visitor Center',
    year: 2006,
    location: 'Cameron Highlands',
    detailContent: [
      {
        type: 'text',
        heading: 'Phase 1',
        content: 'Approaching the 145m-long, 9m-wide building, visitors are greeted by a large cantilevered balcony that stretches over the valley. A mature tree has been carefully preserved, anchoring the building within its natural landscape.'
      },
      {
        type: 'text',
        content: 'The BOH Visitor Centre offers guests the opportunity to appreciate the estate\'s scenic beauty while accommodating the estate\'s operational needs, including meeting sales targets, housing the existing tea shop, and enhancing visitor facilities. The true experience of the building comes not from intricate detailing or construction techniques alone, but from its thoughtful disposition.' 
      },
      {
        type: 'text',
        content: 'BOH is about guiding visitors along a simple path to a destination: atop a hill, through an enclosed space, arriving at the old factory where tea is hand-crafted. The design was never intended to displace existing structures or facilities. Instead, it enhances the journey, allowing the landscape, the building, and the tea-making tradition to coexist seamlessly.'
      },
      {
        type: 'text',
        heading: 'boh visitor centre-extension',
        content: 'Phase 2 of the BOH Visitor Centre expands the experience of the tea estate with a new cafeteria and open, flowing spaces. What is seemingly a simple pitched-roof structure actually took a long time to fabricate largely due to the many different angles for the beams and gutters to form the storm water design needed at that level.'
      },
      {
        type: 'text',
        content: 'The glazing features continues the concept from the first phase, but now features glass louvres that extend to the top panels of the very much open facade, replacing the timber logs and iron grating. Wide walkways with reinforced concrete deck roofs flank one side of the tea center, planted with wall climbers to soften the structure.'
      },
      {
        type: 'text',
        content: 'Unlike the first phase, which projects out over the hill, the undulating roof of the second phase follows the slope, creating a form that complements the first building. The new cafeteria offers direct views into the estate, giving visitors an immersive experience of the surrounding landscape.'
      },
      {
        type: 'text',
        content: 'BOH Visitor Centre, Cameron Highlands, 2006. BOH Extension, Cameron Highlands, 2019.'
      },
    ],
    heroImage: '/projects/boh-visitor/A1.avif',
    images: [
      '/projects/boh-visitor/A1.avif',
      '/projects/boh-visitor/A2.avif',
      '/projects/boh-visitor/A3.avif',
      '/projects/boh-visitor/A4.avif',
      '/projects/boh-visitor/A5.avif',

    ],
  },
  {
    id: '4',
    slug: 'wangsa-ukay-residence',
    title: 'wangsa ukay residence',
    year: 2019,
    location: 'kuala lumpur',
    detailContent: [
      {
        type: 'text',
        content: 'Naturally ventilated homes are increasingly rare in an age dominated by air conditioning and digital comforts. Gated communities, high-rise apartments, and fast-paced lifestyles have conditioned us to live disconnected from greenery and fresh air.'
      },
      {
        type: 'text',
        content: 'As Alan Watts professed that civilization is flawed couldn’t be more pertinent in his observation of how we have slowly allowed technology to dictate our wellbeing. This house proposes not only to reclaim the connections we once had with the environment but also to contend with smaller occupied space.'
      },
      {
        type: 'text',
        content: 'Nearly half of the home is open to the elements, with almost no doors except for bathrooms. Over 27 years, the house has undergone three transformations, each retrofitting the space to reflect evolving philosophies of living and sharing the planet. With every renovation, over a third of walls and floor space have been removed, yet the ambient experience grows larger.'
      },
      {
        type: 'text',
        content: 'Sunlight, carving deep into the house, offers a quality no artificial light can replicate. Rain and breeze flow freely, so that even inside the living room or kitchen, one never quite feels fully enclosed. Windows have disappeared, doors now open completely or vanish entirely, dissolving barriers between interior and exterior.'
      },
      {
        type: 'text',
        content: 'This project taught us that architecture is a never-ending process. The building is alive, responding to what we place inside it and what we take away from it; an evolving dialogue between space, light, air, and the life it shelters.'
      },
    ],
    heroImage: '/projects/wangsa-ukay/A1.avif',
    images: [
      '/projects/wangsa-ukay/A1.avif',
      '/projects/wangsa-ukay/A2.avif',
      '/projects/wangsa-ukay/A3.avif',
      '/projects/wangsa-ukay/A4.avif',
    ],
  },
  {
    id: '5',
    slug: 'lantern-hotel',
    title: 'lantern hotel',
    year: 2015,
    location: 'kuala lumpur',
    detailContent: [
      {
        type: 'text',
        content: 'Lantern Hotel is a 49-room facility. The project started with a casual walk with the clients through Chinatown, Kuala Lumpur, where we witnessed a dilapidated office space that had operated as a bookstore for several years. Its location within the city\'s heritage zone made it a rare opportunity, though the project came with a very small fee and an unusually tight budget.' 
      },
      {
        type: 'text',
        content: 'The original facade was already quite dreadful, with many curved arches, and black and blue tinted glass in twisted frames, and much of the original structure hidden behind broken electrical equipment and desolate spaces. Many obstructions at the entrance of the building had to be cleared, and approvals were carefully negotiated to open up the entryway without having to demolish and rebuild a statutory compliance for setbacks in heritage areas.'
      },
      {
        type: 'text',
        content: 'Natural light was introduced through a large skylight on the top floor, illuminating the interior from above. The facade was more or less left as it was but transformed through cladding with very dark, almost black, burnt clay bricks. The contractors had helped to locate and find a brick supplier and manufacturer who would procure and resurrect what was already a dying trade.'
      },
      {
        type: 'text',
        content: 'Inside, Lantern Hotel features an open layout with a narrow, triple-height atrium, its windows overlooking the void and drawing light deep into the space, creating a sense of openness and continuity.'
      },
    ],
    heroImage: '/projects/lantern-hotel/A4.avif',
    images: [
      '/projects/lantern-hotel/A1.avif',
      '/projects/lantern-hotel/A2.avif',
      '/projects/lantern-hotel/A3.avif',
      '/projects/lantern-hotel/A4.avif',
      '/projects/lantern-hotel/A5.avif',
      '/projects/lantern-hotel/A6.avif',
    ],
  },
  {
    id: '6',
    slug: 'nimes-mediateque-museum',
    title: 'Nimes Mediateque Museum',
    year: 2015,
    location: 'kuala lumpur',
    detailContent: [
      {
        type: 'text',
        content: 'the mediateque was originally a competition in which huat worked on when he was at foster 1984-87 based in london.' 
      },
      {
        type: 'text',
        content: 'huat was one of four english architects who moved to france to set up the foster team in lyons france under the direction of martin francis, norman connection based in south of france.'
      },
      {
        type: 'text',
        content: 'the mediatecque is unique for its location facing la maison carre andnits glass staircase and intricate rooflights. many sketches were produced by the team, among them a large axonometric which covered the entire wall of their studio in jardin de la fontaines in nimes.'
      },
    ],
    heroImage: '/projects/nimes-museum/A1.avif',
    images: [
      '/projects/nimes-museum/A1.avif',
      '/projects/nimes-museum/A2.avif',
      '/projects/nimes-museum/A3.avif',
      '/projects/nimes-museum/A4.avif',
    ],
  },
  {
    id: '7',
    slug: 'the-stonor',
    title: 'the stonor',
    year: 2022,
    location: 'kuala lumpur',
    detailContent: [
      {
        type: 'text',
        content: 'the stonor is a development that is conceptually a reflection of modern urban life. it is iconic in terms of its arrival statement- rather than its facade design. open plan high ceilings and natural finishes are abundant and telling characteristics of the spaces on the ground floor.' 
      },
      {
        type: 'text',
        content: 'all apartments have high ceiling and a general sense of openness and tranquil geometry - an attestation to beauty, ease, comfort and sophistication. expanding on the urban room concept each apartment has the opportunity to be open to the sky and engage with views to the city or the street life of jalan stonor. nature is constant theme throughout the common areas- a secret garden welcomes every resident home before they emerge from their vehicles. on the roof the trees and lush gardens welcome the arrival of residents again by the pool and the gym facilities. energy is a major consideration and asset to be contend with for this project - we respect daylight factor and the careful use of resources for lighting and indoor air quality.'
      },
      {
        type: 'text',
        content: 'the porosity of the ground levels and the open deck concept at the pool leaves are clear demarcations of how urban lifestyles should evolve into rien next generation and typology. never anywhere has anything of this sort been implemented for city dwellers. engagement with nature without compromising security or safety of residents of any generation.'
      },
    ],
    heroImage: '/projects/the-stonor/CP.avif',
    images: [
      '/projects/the-stonor/CP.avif',
      '/projects/the-stonor/A1.avif',
      '/projects/the-stonor/A2.avif',
      '/projects/the-stonor/A3.avif',
      '/projects/the-stonor/A4.avif',
      '/projects/the-stonor/A5.avif',
    ],
  },
];