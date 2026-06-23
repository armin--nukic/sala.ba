import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type VenueCategory } from "@prisma/client";

const prisma = new PrismaClient();

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

async function upsertUser(email: string, password: string, name: string, role: "ADMIN" | "SUPER_ADMIN") {
  await prisma.user.upsert({
    where: { email },
    update: { role },
    create: {
      email,
      name,
      role,
      passwordHash: await bcrypt.hash(password, 12)
    }
  });
}

async function main() {
  await upsertUser(
    process.env.SEED_ADMIN_EMAIL ?? "admin@sala.ba",
    process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!",
    "Sala Admin",
    "ADMIN"
  );
  await upsertUser(
    process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@sala.ba",
    process.env.SEED_SUPER_ADMIN_PASSWORD ?? "SuperAdmin12345!",
    "Sala Super Admin",
    "SUPER_ADMIN"
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
      imageUrl: image("photo-1518611012118-696072aa579a")
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
      imageUrl: image("photo-1518063319789-7217e6706b04")
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
      imageUrl: image("photo-1546519638-68e109498ffc")
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
      imageUrl: image("photo-1511578314322-379afb476865")
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
      imageUrl: image("photo-1527529482837-4698179dc6ce")
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
