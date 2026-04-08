/* Seed current hardcoded site content into MongoDB for Admin dashboard.
 *
 * - Team members: from hardcoded TEAM_PROFILES (kept in this file for stability)
 * - Media: from current gallery page list
 *
 * Run: node scripts/seed-admin-data.js
 */

const mongoose = require("mongoose");
const path = require("path");

// Load `nexus-backend/.env` for local seeding (so seed uses the same DB as the server).
// On Vercel, use Project Environment Variables.
if (!process.env.VERCEL) {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const TeamMember = require(path.join(__dirname, "..", "models", "TeamMember"));
const Media = require(path.join(__dirname, "..", "models", "Media"));
const Announcement = require(path.join(__dirname, "..", "models", "Announcement"));
const Member = require(path.join(__dirname, "..", "models", "Member"));

// Note: MongoDB database names are case-sensitive on some setups.
// Keep the default DB name consistent with existing local usage.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/NExsDB";

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
    // Seed items currently used across home + gallery pages.
    // Note: Google Drive "view?usp=sharing" URLs are not direct file URLs; admin can replace them with direct links.
    { type: "image", src: "/images/NCA07759.JPG", alt: "Students collaborating at laptops", title: "Collaboration", order: 10 },
    { type: "image", src: "https://drive.google.com/file/d/1zqLo6nDQ4WyJtJpr-Mr6Ecaiom9zApFG/view?usp=sharing", alt: "Team meeting in modern office", title: "Team meet", order: 20 },
    { type: "video", src: "https://drive.google.com/file/d/1xrCZMGv0bofnm1tLS-z9GDPIATKID0TS/view?usp=sharing", alt: "NeXs gallery video", title: "NeXs video", order: 30 },

    { type: "image", src: "/images/NCA07711.jpg", alt: "Team meeting in modern office", title: "Team meet (local)", order: 40 },
    { type: "image", src: "/images/NCA07677.jpg", alt: "Developer workspace with code", title: "Build time", order: 50 },
    { type: "image", src: "/images/NCA07700.jpg", alt: "Team working together", title: "Together", order: 60 },
    { type: "image", src: "/images/NCA07848.jpg", alt: "Handshake partnership", title: "Partnership", order: 70 },
    { type: "image", src: "/images/NCA07841.jpg", alt: "Analytics and growth", title: "Growth", order: 80 },
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

async function upsertAnnouncements() {
  const items = [
    {
      title: "Welcome to NeXs",
      description: "New projects, workshops, and mentor sessions are starting soon. Stay tuned for updates.",
    },
    {
      title: "Join the community",
      description: "Interested in Full Stack, AI/ML, UI/UX, Mobile, or Robotics? Apply via the Join page.",
    },
    {
      title: "Demo day preparation",
      description: "Teams: keep your repos tidy, write READMEs, and track milestones weekly.",
    },
  ];

  for (const a of items) {
    await Announcement.findOneAndUpdate(
      { title: a.title },
      { title: a.title, description: a.description },
      { upsert: true, new: true }
    );
  }
}

async function upsertMembers() {
  // Optional starter records so the Admin UI isn't empty on first run.
  const items = [
    {
      name: "Sample Member",
      role: "Developer",
      department: "CSE",
      bio: "Edit or delete this sample from the Admin dashboard.",
      image: "",
      linkedin: "",
      github: "",
      order: 10,
      active: false,
    },
  ];

  for (const m of items) {
    await Member.findOneAndUpdate(
      { name: m.name, role: m.role },
      m,
      { upsert: true, new: true }
    );
  }
}

async function main() {
  console.log("Seeding admin data…");
  await mongoose.connect(MONGODB_URI);
  await upsertTeam();
  await upsertMedia();
  await upsertAnnouncements();
  await upsertMembers();
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

