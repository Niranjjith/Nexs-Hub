/* Seed current hardcoded site content into MongoDB for Admin dashboard.
 *
 * - Team members: from hardcoded TEAM_PROFILES (kept in this file for stability)
 * - Media: from current gallery page list
 *
 * Run: node scripts/seed-admin-data.js
 */

const mongoose = require("mongoose");
const path = require("path");

const TeamMember = require(path.join(__dirname, "..", "models", "TeamMember"));
const Media = require(path.join(__dirname, "..", "models", "Media"));

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://niranjjithbathery_db_user:WG9L9JRa7eiSv78y@cluster0.24uzbdb.mongodb.net/?appName=Cluster0";

function normalizeSrc(src) {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return src;
  return "/" + src.replace(/^\.?\//, "");
}

async function upsertTeam() {
  const TEAM_PROFILES = {
    alex: {
      name: "Niranjan A R",
      role: "Director",
      image: "images/team/Niranjan.jpg",
      bio:
        "Alex sets the vision for NExs and keeps our programs aligned with student needs and industry partners. Former product lead at a campus spin-out, they care about sustainable teams and clear milestones.",
      meta: ["Leadership", "Strategy", "4 yrs with NExs"],
      projects: [
        { name: "NExs governance & OKRs", desc: "Defined quarterly goals and mentor matching so squads stay unblocked." },
        { name: "Industry advisory board", desc: "Recruited partners for demo days and internship pipelines." },
        { name: "Startup Launchpad v1", desc: "Co-designed the first incubator curriculum and pitch rubric." },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Email", href: "mailto:alex@NExs.local" },
      ],
      order: 10,
      active: true,
    },
    jordan: {
      name: "Nezal Muhammed",
      role: "Programs Lead",
      image: "/images/team/nxl.jpg",
      bio:
        "Jordan runs workshops, office hours, and the event calendar. They translate messy ideas into schedules people can actually follow—without killing creativity.",
      meta: ["Programs", "Events", "CS & HCI"],
      projects: [
        { name: "Hack night series", desc: "Monthly themes, judging criteria, and sponsor swag that actually helps teams ship." },
        { name: "Mentor office hours", desc: "Rolled out booking system and mentor playbooks for consistent feedback." },
        { name: "Smart Campus pilot", desc: "Coordinated student teams with facilities for the first IoT trial spaces." },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "GitHub", href: "https://github.com/" },
      ],
      order: 20,
      active: true,
    },
    sam: {
      name: "Ansar Ahamed",
      role: "Tech Mentor",
      image: "/images/team/Ansar.jpeg",
      bio:
        "Sam is our go-to for architecture reviews, security basics, and shipping on a deadline. They have shipped production APIs and enjoy helping teams pick the boring technology that scales.",
      meta: ["Backend & DevOps", "Mentor", "Security"],
      projects: [
        { name: "AI Security Lab", desc: "Mentored the ML pipeline design and evaluation metrics for malware classifiers." },
        { name: "Campus API standards", desc: "Auth patterns and rate limits shared across NExs project teams." },
        { name: "CI templates", desc: "Starter GitHub Actions workflows for Node and Python stacks." },
      ],
      social: [
        { label: "GitHub", href: "https://github.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
      order: 30,
      active: true,
    },
    priya: {
      name: "Adul Isham",
      role: "Design Lead",
      image: "/images/team/Athul.jpg",
      bio:
        "Priya leads UX critiques, design systems, and accessibility checks before demo day. She bridges designers and engineers so interfaces stay coherent under real data.",
      meta: ["UX / UI", "Design systems", "A11y"],
      projects: [
        { name: "NExs design kit", desc: "Figma libraries and tokens used across student projects for consistency." },
        { name: "Smart Campus app flows", desc: "Mapped navigation and error states for the first campus companion prototype." },
        { name: "Demo day decks", desc: "Templates and story structure so teams present outcomes, not only screenshots." },
      ],
      social: [
        { label: "Portfolio", href: "#" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
      order: 40,
      active: true,
    },
    miguel: {
      name: "Sha Rahshima",
      role: "Partnerships",
      image: "images/team/Sha.jpg",
      bio:
        "Miguel connects NExs with labs, startups, and alumni who want to mentor or hire. He negotiates lightweight agreements so students can use real datasets and tools ethically.",
      meta: ["Partnerships", "Legal basics", "Alumni"],
      projects: [
        { name: "Sponsor playbook", desc: "Clear packages for companies supporting hackathons without heavy contracts." },
        { name: "Data-use guidelines", desc: "Templates for student teams working with partner-provided samples." },
        { name: "Career fair bridge", desc: "Coordinated intros between top teams and hiring managers post-demo." },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Email", href: "mailto:miguel@NExs.local" },
      ],
      order: 50,
      active: true,
    },
    nina: {
      name: "Rifad",
      role: "Community",
      image: "/images/team/rifad.jpg",
      bio:
        "Iam grows an inclusive culture: onboarding newcomers, moderating chat, and celebrating wins. She makes sure every voice gets heard in critiques and retros.",
      meta: ["Community", "Comms", "DEI"],
      projects: [
        { name: "Onboarding cohorts", desc: "Buddy system and first-week checklist for new NExs members." },
        { name: "Community guidelines", desc: "Code of conduct and escalation paths for online and in-person events." },
        { name: "Showcase newsletter", desc: "Monthly highlights of shipped work and open roles inside the hub." },
      ],
      social: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Twitter / X", href: "https://twitter.com/" },
      ],
      order: 60,
      active: true,
    },
  };

  const slugs = Object.keys(TEAM_PROFILES);
  for (const slug of slugs) {
    const p = TEAM_PROFILES[slug];
    await TeamMember.findOneAndUpdate(
      { slug },
      {
        slug,
        name: p.name,
        role: p.role,
        image: normalizeSrc(p.image),
        bio: p.bio,
        meta: p.meta || [],
        projects: p.projects || [],
        social: p.social || [],
        order: p.order || 0,
        active: p.active !== false,
      },
      { upsert: true, new: true }
    );
  }
}

async function upsertMedia() {
  const items = [
    { type: "image", src: "/images/NCA07721.jpg", alt: "Students collaborating at laptops", title: "Collaboration", order: 10 },
    { type: "image", src: "/images/NCA07711.jpg", alt: "Team meeting in modern office", title: "Team meet", order: 20 },
    { type: "image", src: "/images/NCA07677.jpg", alt: "Developer workspace with code", title: "Build time", order: 30 },
    { type: "video", src: "/images/fff.mp4", alt: "NeXs gallery video", title: "NeXs video", order: 40 },
    { type: "image", src: "/images/NCA07737.jpg", alt: "Team working together", title: "Together", order: 50 },
    { type: "image", src: "/images/NCA07848.jpg", alt: "Handshake partnership", title: "Partnership", order: 60 },
    { type: "image", src: "/images/NCA07841.jpg", alt: "Analytics and growth", title: "Growth", order: 70 },
    // Remaining are still Unsplash in gallery.html — seeded as-is so admin can replace them later.
    { type: "image", src: "https://images.unsplash.com/photo-1517245386807-9b4ed4b7c3a?w=800&q=80", alt: "Presentation in meeting room", title: "Presentation", order: 80 },
    { type: "image", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", alt: "People working on laptops together", title: "Workshop", order: 90 },
    { type: "image", src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", alt: "Students studying outdoors", title: "Learning", order: 100 },
    { type: "image", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", alt: "Team workshop brainstorm", title: "Brainstorm", order: 110 },
    { type: "image", src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", alt: "Planning session with documents", title: "Planning", order: 120 },
    { type: "image", src: "https://images.unsplash.com/photo-1516321318429-f886fddd1453?w=800&q=80", alt: "Audience at tech event", title: "Event", order: 130 },
  ];

  for (const m of items) {
    await Media.findOneAndUpdate(
      { src: m.src },
      {
        type: m.type,
        src: m.src,
        title: m.title || "",
        alt: m.alt || "",
        order: m.order || 0,
        active: true,
      },
      { upsert: true, new: true }
    );
  }
}

async function main() {
  console.log("Seeding admin data…");
  await mongoose.connect(MONGODB_URI);
  await upsertTeam();
  await upsertMedia();
  console.log("Seed complete.");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

