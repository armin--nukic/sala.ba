import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Role, type VenueCategory } from "@prisma/client";

const prisma = new PrismaClient();

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const mapsLink = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`;

const cityData = [
  ["Sarajevo", 43.8563, 18.4131],
  ["Mostar", 43.3438, 17.8078],
  ["Tuzla", 44.5384, 18.6671],
  ["Zenica", 44.2034, 17.9077],
  ["Bihać", 44.8169, 15.8708],
  ["Travnik", 44.2264, 17.6658],
  ["Visoko", 43.9889, 18.1781],
  ["Tešanj", 44.6119, 17.9875],
  ["Bugojno", 44.0572, 17.4508],
  ["Konjic", 43.6543, 17.9607],
  ["Brčko", 44.8728, 18.8083],
  ["Banja Luka", 44.7722, 17.1910],
  ["Doboj", 44.7318, 18.0869],
  ["Cazin", 44.9669, 15.9431],
  ["Goražde", 43.6679, 18.9756]
] as const;

const sportTypes = ["Fudbal", "Mali fudbal", "Košarka", "Odbojka", "Tenis", "Padel", "Fitness", "Multifunkcionalne dvorane"];
const sportImages = [
  "photo-1574629810360-7efbbe195018",
  "photo-1526232761682-d26e03ac148e",
  "photo-1546519638-68e109498ffc",
  "photo-1518611012118-696072aa579a",
  "photo-1595435934249-5df7ed86e1c0",
  "photo-1626224583764-f87db24ac4ea",
  "photo-1534438327276-14e5300c3a48",
  "photo-1577223625816-7546f13df25d"
];

const weddingImages = [
  "photo-1519225421980-715cb0215aed",
  "photo-1519167758481-83f550bb49b3",
  "photo-1464366400600-7168b8af9bc3",
  "photo-1519671482749-fd09be7ccebf",
  "photo-1523438885200-e635ba2c371e",
  "photo-1527529482837-4698179dc6ce",
  "photo-1505373877841-8d25f7d46678"
];

async function upsertUser(email: string, password: string, name: string, role: Role) {
  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      isActive: true,
      passwordHash: await bcrypt.hash(password, 12)
    },
    create: {
      email,
      name,
      role,
      isActive: true,
      passwordHash: await bcrypt.hash(password, 12)
    }
  });
}

async function main() {
  const superAdmin = await upsertUser(
    process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@sala.ba",
    process.env.SEED_SUPER_ADMIN_PASSWORD ?? "SuperAdmin12345!",
    "Sala Super Admin",
    "SUPER_ADMIN"
  );
  await upsertUser(
    process.env.SEED_ADMIN_EMAIL ?? "admin@sala.ba",
    process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!",
    "Sala Admin",
    "ADMIN"
  );
  const owner = await upsertUser(
    process.env.SEED_OWNER_EMAIL ?? "owner@sala.ba",
    process.env.SEED_OWNER_PASSWORD ?? "Owner12345!",
    "Sala Owner",
    "OWNER"
  );
  await upsertUser(
    process.env.SEED_USER_EMAIL ?? "user@sala.ba",
    process.env.SEED_USER_PASSWORD ?? "User12345!",
    "Sala User",
    "USER"
  );

  const venues: Array<{
    name: string;
    slug: string;
    description: string;
    city: string;
    address: string;
    category: VenueCategory;
    capacity: number;
    priceFrom: number;
    phone: string;
    email: string;
    imageUrl: string;
    galleryImages?: string[];
    ownerId?: string;
    isFeatured?: boolean;
  }> = [
    {
      name: "Crystal Wedding Hall",
      slug: "crystal-wedding-hall",
      description: "Elegantna sala za vjencanja sa premium rasvjetom, velikim plesnim podijem i kompletnom uslugom.",
      city: "Sarajevo",
      address: "Zmaja od Bosne 12",
      category: "Wedding",
      capacity: 420,
      priceFrom: 3200,
      phone: "+387 61 111 222",
      email: "crystal@sala.ba",
      imageUrl: image("photo-1519167758481-83f550bb49b3"),
      galleryImages: [image("photo-1464366400600-7168b8af9bc3"), image("photo-1519671482749-fd09be7ccebf")],
      ownerId: owner.id,
      isFeatured: true
    },
    {
      name: "Arena Sport Centar",
      slug: "arena-sport-centar",
      description: "Moderna sportska sala za turnire, treninge, rekreativne lige i skolske evente.",
      city: "Tuzla",
      address: "Sportska 7",
      category: "Sport",
      capacity: 900,
      priceFrom: 120,
      phone: "+387 62 333 444",
      email: "arena@sala.ba",
      imageUrl: image("photo-1574629810360-7efbbe195018"),
      galleryImages: [image("photo-1526232761682-d26e03ac148e"), image("photo-1574623452334-1e0ac2b3ccb4")],
      ownerId: owner.id,
      isFeatured: true
    },
    {
      name: "Dvorana Goran Cengic Grbavica",
      slug: "dvorana-goran-cengic-grbavica",
      description: "Grbavicka sportska dvorana za treninge, male turnire, skolske lige i rekreativne termine.",
      city: "Sarajevo",
      address: "Grbavica, Novo Sarajevo",
      category: "Sport",
      capacity: 1200,
      priceFrom: 90,
      phone: "+387 33 000 101",
      email: "goran-cengic@sala.ba",
      imageUrl: image("photo-1526232761682-d26e03ac148e"),
      ownerId: owner.id,
      isFeatured: true
    },
    {
      name: "KSC Ilidza Sports Hall",
      slug: "ksc-ilidza-sports-hall",
      description: "Sportska dvorana na Ilidzi za termine po satu, rekreativne utakmice, turnire i trening kampove.",
      city: "Ilidza",
      address: "Ilidza centar",
      category: "Sport",
      capacity: 1600,
      priceFrom: 110,
      phone: "+387 33 000 102",
      email: "ksc-ilidza@sala.ba",
      imageUrl: image("photo-1574623452334-1e0ac2b3ccb4"),
      ownerId: owner.id,
      isFeatured: true
    },
    {
      name: "KSC Ilijas",
      slug: "ksc-ilijas",
      description: "Multifunkcionalni sportski centar za skolske turnire, klubove, rukomet, futsal i zajednicke evente.",
      city: "Ilijas",
      address: "Ilijas bb",
      category: "Sport",
      capacity: 1000,
      priceFrom: 85,
      phone: "+387 33 000 103",
      email: "ksc-ilijas@sala.ba",
      imageUrl: image("photo-1518611012118-696072aa579a"),
      ownerId: owner.id
    },
    {
      name: "KSC Kakanj",
      slug: "ksc-kakanj",
      description: "Sportski centar u Kaknju za termine, utakmice, turnire, treninge i lokalne manifestacije.",
      city: "Kakanj",
      address: "Kakanj centar",
      category: "Sport",
      capacity: 1400,
      priceFrom: 95,
      phone: "+387 32 000 104",
      email: "ksc-kakanj@sala.ba",
      imageUrl: image("photo-1518063319789-7217e6706b04"),
      ownerId: owner.id
    },
    {
      name: "Mladost Visoko Sports Hall",
      slug: "mladost-visoko-sports-hall",
      description: "Visocka dvorana za sport, treninge, rekreativne lige i vikend turnire sa jednostavnim upitom za termin.",
      city: "Visoko",
      address: "Mladost Visoko",
      category: "Sport",
      capacity: 1300,
      priceFrom: 90,
      phone: "+387 32 000 105",
      email: "mladost-visoko@sala.ba",
      imageUrl: image("photo-1546519638-68e109498ffc"),
      ownerId: owner.id
    },
    {
      name: "Diaspora Event House",
      slug: "diaspora-event-house",
      description: "Prostor optimizovan za rezervacije iz dijaspore, video obilazak i fleksibilne pakete.",
      city: "Mostar",
      address: "Bulevar 44",
      category: "Diaspora",
      capacity: 260,
      priceFrom: 1800,
      phone: "+387 63 555 666",
      email: "diaspora@sala.ba",
      imageUrl: image("photo-1505236858219-8359eb29e329"),
      ownerId: owner.id,
      isFeatured: true
    },
    {
      name: "Business Forum Hall",
      slug: "business-forum-hall",
      description: "Konferencijski prostor sa AV opremom, breakout sobama i catering opcijama.",
      city: "Banja Luka",
      address: "Kralja Petra I 22",
      category: "Conference",
      capacity: 180,
      priceFrom: 900,
      phone: "+387 65 777 888",
      email: "forum@sala.ba",
      imageUrl: image("photo-1511578314322-379afb476865"),
      ownerId: superAdmin.id
    },
    {
      name: "Garden Celebration Loft",
      slug: "garden-celebration-loft",
      description: "Topao i urban prostor za rodjendane, promocije, proslave i privatne evente.",
      city: "Zenica",
      address: "Titova 15",
      category: "Celebration",
      capacity: 140,
      priceFrom: 650,
      phone: "+387 61 999 000",
      email: "garden@sala.ba",
      imageUrl: image("photo-1527529482837-4698179dc6ce"),
      ownerId: owner.id
    },
    {
      name: "Hotel Hills Grand Ballroom",
      slug: "hotel-hills-grand-ballroom",
      description: "Velika ilidzanska ballroom sala za svadbe, kongrese i dijaspora proslave sa hotelskim smjestajem.",
      city: "Sarajevo",
      address: "Butmirska cesta 18",
      category: "Wedding",
      capacity: 850,
      priceFrom: 145,
      phone: "+387 33 947 947",
      email: "events@hotel-hills.ba",
      imageUrl: image("photo-1464366400600-7168b8af9bc3"),
      isFeatured: true
    },
    {
      name: "Hotel Hollywood Event Hall",
      slug: "hotel-hollywood-event-hall",
      description: "Poznat event kompleks za velike svadbe, maturske veceri i poslovne evente u Sarajevu.",
      city: "Sarajevo",
      address: "Dr. Pintola 23",
      category: "Wedding",
      capacity: 650,
      priceFrom: 120,
      phone: "+387 33 773 100",
      email: "events@hotel-hollywood.ba",
      imageUrl: image("photo-1519671482749-fd09be7ccebf"),
      isFeatured: true
    },
    {
      name: "Mepas Wedding & Congress Hall",
      slug: "mepas-wedding-congress-hall",
      description: "Mostarski premium prostor za vjencanja, konferencije i privatne evente sa urbanim hotelskim stilom.",
      city: "Mostar",
      address: "Kardinala Stepinca bb",
      category: "Wedding",
      capacity: 430,
      priceFrom: 115,
      phone: "+387 36 382 000",
      email: "events@mepas.ba",
      imageUrl: image("photo-1505373877841-8d25f7d46678")
    },
    {
      name: "Mellain Crystal Hall",
      slug: "mellain-crystal-hall",
      description: "Elegantna tuzlanska sala za svadbe i proslave, pogodna za vece porodicne i poslovne dogadjaje.",
      city: "Tuzla",
      address: "Aleja Alije Izetbegovica 3",
      category: "Wedding",
      capacity: 500,
      priceFrom: 105,
      phone: "+387 35 365 500",
      email: "events@mellain.ba",
      imageUrl: image("photo-1523438885200-e635ba2c371e")
    },
    {
      name: "Hotel Bosna Banquet Hall",
      slug: "hotel-bosna-banquet-hall",
      description: "Klasicna gradska sala u centru Banje Luke za vjencanja, bankete i poslovne prijeme.",
      city: "Banja Luka",
      address: "Kralja Petra I Karadjordjevica 97",
      category: "Wedding",
      capacity: 360,
      priceFrom: 95,
      phone: "+387 51 215 775",
      email: "events@hotelbosna.com",
      imageUrl: image("photo-1519225421980-715cb0215aed")
    },
    {
      name: "Skenderija Mirza Delibasic Hall",
      slug: "skenderija-mirza-delibasic-hall",
      description: "Velika sarajevska dvorana za sportske utakmice, turnire, sajmove i masovne evente.",
      city: "Sarajevo",
      address: "Terezija bb",
      category: "Sport",
      capacity: 6000,
      priceFrom: 850,
      phone: "+387 33 226 612",
      email: "info@skenderija.ba",
      imageUrl: image("photo-1546519638-68e109498ffc"),
      isFeatured: true
    },
    {
      name: "Zetra Olympic Hall",
      slug: "zetra-olympic-hall",
      description: "Olimpijska dvorana za velike sportske dogadjaje, koncerte, sajmove i produkcije.",
      city: "Sarajevo",
      address: "Alipasina bb",
      category: "Sport",
      capacity: 12000,
      priceFrom: 1500,
      phone: "+387 33 276 100",
      email: "info@zetra.ba",
      imageUrl: image("photo-1577223625816-7546f13df25d")
    },
    {
      name: "Mejdan Tuzla Sports Hall",
      slug: "mejdan-tuzla-sports-hall",
      description: "Tuzlanska dvorana za kosarku, rukomet, turnire, koncerte i gradske manifestacije.",
      city: "Tuzla",
      address: "Bosne Srebrene bb",
      category: "Sport",
      capacity: 4900,
      priceFrom: 650,
      phone: "+387 35 250 500",
      email: "info@mejdan.ba",
      imageUrl: image("photo-1519861531473-9200262188bf")
    },
    {
      name: "Arena Husejin Smajlovic",
      slug: "arena-husejin-smajlovic",
      description: "Moderna zenička arena za sport, sajmove i velike evente u centralnoj Bosni.",
      city: "Zenica",
      address: "Bulevar Kulina bana bb",
      category: "Sport",
      capacity: 6200,
      priceFrom: 700,
      phone: "+387 32 449 420",
      email: "arena@zenica.ba",
      imageUrl: image("photo-1505666287802-931dc83a63e9")
    }
  ];

  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      update: venue,
      create: venue
    });
  }

  const sportVenues = Array.from({ length: 30 }, (_, index) => {
    const city = cityData[index % cityData.length];
    const primarySport = sportTypes[index % sportTypes.length];
    const secondarySport = sportTypes[(index + 3) % sportTypes.length];
    const lat = Number((city[1] + (index % 5) * 0.004).toFixed(6));
    const lng = Number((city[2] + (index % 4) * 0.004).toFixed(6));
    const name = `${primarySport} Centar ${city[0]} ${Math.floor(index / cityData.length) + 1}`;
    return {
      name,
      slug: slugify(name),
      description: `${name} je sportski objekat za ${primarySport.toLowerCase()}, treninge, rekreaciju, termine po satu i organizaciju lokalnih turnira.`,
      city: city[0],
      address: `Sportska ${index + 1}`,
      category: "Sport" as VenueCategory,
      capacity: 80 + index * 18,
      priceFrom: 35 + (index % 8) * 15,
      phone: `+387 6${index % 10} ${String(120000 + index).replace(/(\d{3})(\d{3})/, "$1 $2")}`,
      email: `sport-${slugify(city[0])}-${index + 1}@sala.ba`,
      imageUrl: image(sportImages[index % sportImages.length]),
      galleryImages: [image(sportImages[(index + 1) % sportImages.length]), image(sportImages[(index + 2) % sportImages.length])],
      latitude: lat,
      longitude: lng,
      googleMapsUrl: mapsLink(lat, lng),
      sports: [primarySport, secondarySport],
      courtCount: 1 + (index % 5),
      parking: index % 2 === 0,
      lockerRooms: index % 3 !== 0,
      floodlights: index % 4 !== 0,
      reservationsEnabled: true,
      workingHours: index % 2 === 0 ? "08:00 - 23:00" : "09:00 - 22:00",
      ownerId: owner.id,
      isActive: true,
      isFeatured: index < 6
    };
  });

  const weddingVenues = Array.from({ length: 20 }, (_, index) => {
    const city = cityData[(index * 2) % cityData.length];
    const lat = Number((city[1] + (index % 4) * 0.003).toFixed(6));
    const lng = Number((city[2] + (index % 5) * 0.003).toFixed(6));
    const name = `${["Royal", "Crystal", "Garden", "Grand", "Mosaic"][index % 5]} Wedding Hall ${city[0]}`;
    return {
      name,
      slug: slugify(`${name}-${index + 1}`),
      description: `${name} nudi svadbene pakete, dekoraciju, catering, parking i organizaciju proslava za goste iz BiH i dijaspore.`,
      city: city[0],
      address: `Svadbena ${index + 4}`,
      category: "Wedding" as VenueCategory,
      capacity: 140 + index * 28,
      priceFrom: 70 + (index % 9) * 18,
      phone: `+387 6${(index + 3) % 10} ${String(330000 + index).replace(/(\d{3})(\d{3})/, "$1 $2")}`,
      email: `wedding-${slugify(city[0])}-${index + 1}@sala.ba`,
      imageUrl: image(weddingImages[index % weddingImages.length]),
      galleryImages: [image(weddingImages[(index + 1) % weddingImages.length]), image(weddingImages[(index + 2) % weddingImages.length])],
      latitude: lat,
      longitude: lng,
      googleMapsUrl: mapsLink(lat, lng),
      sports: [],
      courtCount: null,
      parking: true,
      lockerRooms: false,
      floodlights: true,
      reservationsEnabled: true,
      workingHours: "10:00 - 24:00",
      ownerId: owner.id,
      isActive: true,
      isFeatured: index < 5
    };
  });

  for (const venue of [...sportVenues, ...weddingVenues]) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      update: venue,
      create: venue
    });
  }

  const firstVenue = await prisma.venue.findFirst({ where: { slug: "hotel-hills-grand-ballroom" } });
  if (firstVenue) {
    await prisma.review.createMany({
      data: [
        { venueId: firstVenue.id, name: "Amina", rating: 5, comment: "Brz odgovor i odlicna organizacija termina za porodicu iz dijaspore." },
        { venueId: firstVenue.id, name: "Tarik", rating: 4, comment: "Pregledno, odmah smo vidjeli kapacitet i okvirnu cijenu." }
      ],
      skipDuplicates: true
    });
  }

  await prisma.forumPost.createMany({
    data: [
      { title: "Koliko ranije rezervisati salu za ljeto?", body: "Za vece svadbe u Sarajevu i Mostaru preporuka je 6 do 12 mjeseci ranije.", city: "Sarajevo" },
      { title: "Sportska dvorana za vikend turnir", body: "Trazim dvoranu za mali nogomet sa terminima subotom i opcijom tribina.", city: "Tuzla" }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
