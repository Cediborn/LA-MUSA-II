/* GLCL structured site data.
   Repeated content lives here so pages stay consistent and easy to update.
   Only confirmed company facts from the master brief are included. */

export const NAV = [
  { label: "Home", href: "index.html" },
  { label: "Services", href: "services.html" },
  { label: "About", href: "about.html" },
  { label: "Gallery", href: "gallery.html" },
  { label: "Contact", href: "contact.html" },
];

export const CONTACT = {
  email: "getlabourcompanylimited@gmail.com",
  phone1: { label: "+233 303 961 288", tel: "+233303961288" },
  phone2: { label: "+233 558 007 876", tel: "+233558007876" },
  address: "Meridian Road, Tema, Ghana",
  plusCode: "JXHR+GF Tema",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=JXHR%2BGF%20Tema",
  established: "July 2013",
  slogan: "Your Complete Labour Solution",
  site: "https://getlabour.org",
};

export const SOCIAL = [
  {
    name: "WhatsApp",
    href: "https://wa.me/233303961288",
    icon: "whatsapp",
    ariaLabel: "Chat with GLCL on WhatsApp",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/getlabour-2025i",
    icon: "linkedin",
    ariaLabel: "GLCL on LinkedIn",
  },
  {
    name: "X",
    href: "https://x.com/glcl62025",
    icon: "x",
    ariaLabel: "GLCL on X",
  },
  {
    name: "Email",
    href: "mailto:getlabourcompanylimited@gmail.com",
    icon: "mail",
    ariaLabel: "Email GLCL",
  },
];

export const SERVICES = {
  skilled: {
    id: "skilled",
    title: "Skilled Labour",
    summary:
      "Qualified operational personnel supplied to match the role requested — port, cargo-handling and supporting industrial operations.",
    roles: [
      "Forklift operators",
      "Reach stacker operators",
      "Crane operators",
      "Supervisors / foremen",
      "Drivers / heavy-duty drivers where requested",
      "Tally, record and delivery clerks",
      "Other qualified operational personnel",
    ],
  },
  nonSkilled: {
    id: "non-skilled",
    title: "Non-Skilled Labour",
    summary:
      "Reliable general labour for ashore, transit, topside and onboard-gang work, matched to the request received.",
    roles: [
      "General labourers",
      "Ashore labour",
      "Transit labour",
      "Topside labour",
      "Onboard-gang labour",
    ],
  },
};

export const VALUES = [
  { name: "Reliability", copy: "Requests are taken seriously and handled with consistency." },
  { name: "Professionalism", copy: "Personnel are briefed and presented ready for the work site." },
  { name: "Integrity", copy: "Straight dealing with businesses and with the workers we register." },
  { name: "Efficiency", copy: "Requests are reviewed and matched without unnecessary delay." },
  { name: "Safety", copy: "Safe working practice sits at the centre of how labour is supplied." },
  { name: "Responsibility", copy: "We stay accountable for the support we promise to both sides." },
];

/* Approved staff directory (Section 7 of the master brief).
   detailedBio: keys reference DISCREET_BIOS in bios-data.js — never rendered
   on the public directory; only on the unlinked bios page when enabled. */
export const TEAM = [
  {
    name: "Mr. Alhassan Musah",
    title: "Managing Director",
    image: "assets/images/staff/staff-alhassan-musah-managing-director.jpg",
    bio:
      "Leads Get Labour Company Limited as Managing Director. He established the company in July 2013 after years of hands-on port and cargo-handling work, and remains closely involved in how personnel are selected and deployed for each request.",
    detailedBio: "alhassan-musah",
  },
  {
    name: "Mr. Alhassan Mohammed",
    title: "Logistics Manager",
    image: "assets/images/staff/staff-alhassan-mohammed-logistics-manager.jpg",
    bio:
      "Coordinates the movement and scheduling of labour so that crews arrive where they are needed. His background includes tally, waybill and delivery supervision work, which he brings to the daily logistics of the company.",
    detailedBio: "alhassan-mohammed",
  },
  {
    name: "Mr. John Adjei Kwakye",
    title: "Accountant / Acting Auditor",
    image: "assets/images/staff/staff-john-adjei-kwakye-accountant.jpg",
    bio:
      "Keeps the company's financial records in order and currently also serves in an acting audit capacity. He supports the administrative side of payments, records and reporting for the business.",
  },
  {
    name: "Mrs. Philomena Sagoe Musah",
    title: "Secretary",
    image: null,
    bio:
      "Supports the day-to-day administration and communication of the office, helping keep correspondence, records and scheduling organised.",
    detailedBio: "philomena-sagoe-musah",
  },
  {
    name: "Mr. Hafeez Natogma",
    title: "Operations Manager",
    image: "assets/images/staff/staff-hafeez-natogma-operations-manager.jpg",
    bio:
      "Manages day-to-day operations, from receiving labour requests through to the allocation and follow-up of personnel on site. He is one of the main points of contact for businesses working with GLCL.",
  },
  {
    name: "Mr. Robert Koevi Quantus",
    title: "Chief Allocator & Marketing / Logistics Manager",
    image: "assets/images/staff/staff-robert-koevi-quantus-chief-allocator.jpg",
    bio:
      "Leads allocation of personnel to requests and also handles marketing and logistics responsibilities. He works to make sure the right people, with the right skills, reach the right site.",
  },
  {
    name: "Mr. Degraft Taylor",
    title: "Allocator",
    image: "assets/images/staff/staff-degraft-taylor-allocator.jpg",
    bio:
      "Allocates workers to incoming requests, matching availability and skill to the roles businesses ask for, and keeps track of deployments as they happen.",
  },
  {
    name: "Ms. Zainab Nasigri",
    title: "Acting HR & Assistant Operations Allocator",
    image: "assets/images/staff/staff-zainab-nasigri-acting-hr.jpg",
    bio:
      "Supports the human-resources side of the workforce, including registration and worker records, while also assisting the operations team with allocation.",
  },
  {
    name: "Mr. Ubiadullah Abubakari",
    title: "Assistant Accountant / IT",
    image: null,
    bio:
      "Assists with accounting duties and supports the company's information-technology needs.",
  },
  {
    name: "Ms. Gispa Kafui",
    title: "Assistant Allocator",
    image: "assets/images/staff/staff-gispa-kafui-assistant-allocator.jpg",
    bio:
      "Assists the allocation team in arranging personnel for requests and following up on day-to-day placements.",
  },
  {
    name: "Mr. Joseph Domere",
    title: "Assistant Accountant",
    image: "assets/images/staff/staff-joseph-domere-assistant-accountant.jpg",
    bio:
      "Supports the accountant in maintaining financial records and day-to-day payment administration.",
  },
  {
    name: "Mr. Joseph Asem",
    title: "Chief Driver",
    image: "assets/images/staff/staff-joseph-asem-chief-driver.jpg",
    bio:
      "Responsible for transporting labourers between the GLCL office, the port or designated work sites, and back.",
  },
  {
    name: "Mr. Rahman Abdallah",
    title: "Safety Officer",
    image: null,
    bio:
      "Oversees safe working practice on sites where GLCL labour is supplied and advises the team on protective equipment and safe procedure.",
  },
];

export const REQUEST_ROLES = {
  Skilled: [
    "Forklift operator",
    "Reach stacker operator",
    "Crane operator",
    "Supervisor / foreman",
    "Driver / heavy-duty driver",
    "Tally / record / delivery clerk",
    "Other skilled role — describe request",
  ],
  "Non-Skilled": [
    "General labourer",
    "Ashore labour",
    "Transit labour",
    "Topside labour",
    "Onboard gang labour",
    "Other non-skilled role — describe request",
  ],
  Both: [
    "Mixed skilled and non-skilled gang",
    "Skilled operator with support crew",
    "Supervisor / foremen with general labourers",
    "Describe the full request",
  ],
};
