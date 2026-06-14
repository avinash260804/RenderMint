// ── Atelier Profile Data ──────────────────────────────────────
// Represents the profile of Avinash Varma, Architecture · Mid-Level

export const PROFILE = {
  name: "Avinash Varma",
  discipline: "Architecture",
  specialisation: "Urban Housing Specialist",
  location: "Mumbai, India",
  yearsInPractice: 4,
  level: "Mid-Level" as const,
  milestone: "practitioner" as const, // student | practitioner | contributor | mentor
  milestoneProgress: 68, // percentage toward next milestone
  status: "Open to Collaboration" as const,

  creativeStatement:
    "I believe housing is the most honest test of architectural thinking. My work is rooted in the premise that density and dignity are not opposites — that the constraint of a city lot is an invitation, not an obstacle. I am interested in the space between the section and the street.",

  avatar: null, // no image — renders geometric frame placeholder

  currentWork: "Working on residential façade studies",

  skills: {
    conceptual: [
      { name: "Spatial Reasoning", weight: 5, projectCount: 4 },
      { name: "Narrative Composition", weight: 4, projectCount: 3 },
      { name: "Section Analysis", weight: 5, projectCount: 6 },
      { name: "Urban Context Reading", weight: 3, projectCount: 2 },
      { name: "Typological Research", weight: 3, projectCount: 2 },
    ],
    technical: [
      { name: "AutoCAD", weight: 5, projectCount: 7 },
      { name: "Rhino", weight: 4, projectCount: 3, warning: "No process documentation for Rhino projects" },
      { name: "Revit", weight: 4, projectCount: 5 },
      { name: "Grasshopper", weight: 2, projectCount: 1 },
      { name: "Enscape", weight: 3, projectCount: 4 },
      { name: "InDesign", weight: 3, projectCount: 6 },
    ],
  },

  projects: [
    {
      id: "p1",
      title: "Riverside Cultural Centre",
      subtitle: "Structural Section Study",
      year: 2025,
      discipline: "Architecture",
      stage: "Process Documented" as const,
      critiquesReceived: 12,
      openForCritique: false,
      saved: 34,
      initials: "RC",
      featured: true,
      process: true,
    },
    {
      id: "p2",
      title: "Adaptive Reuse: Former Mill Complex",
      subtitle: "Facade Retention Strategy",
      year: 2025,
      discipline: "Architecture",
      stage: "Case Study" as const,
      critiquesReceived: 8,
      openForCritique: false,
      saved: 21,
      initials: "AM",
      featured: true,
      process: true,
    },
    {
      id: "p3",
      title: "High-Rise Residential Skin Study",
      subtitle: "Facade Perforation System",
      year: 2024,
      discipline: "Architecture",
      stage: "WIP" as const,
      critiquesReceived: 5,
      openForCritique: true,
      saved: 18,
      initials: "HR",
      featured: false,
      process: false,
    },
    {
      id: "p4",
      title: "Urban Housing Prototype",
      subtitle: "Section + Plan Sequence",
      year: 2024,
      discipline: "Architecture",
      stage: "Process Documented" as const,
      critiquesReceived: 9,
      openForCritique: false,
      saved: 27,
      initials: "UH",
      featured: true,
      process: true,
    },
    {
      id: "p5",
      title: "Community Library — Interior Flow",
      subtitle: "Circulation Study",
      year: 2023,
      discipline: "Architecture",
      stage: "Concept Only" as const,
      critiquesReceived: 3,
      openForCritique: false,
      saved: 11,
      initials: "CL",
      featured: false,
      process: false,
    },
    {
      id: "p6",
      title: "Threshold Housing",
      subtitle: "Boundary & Threshold Study",
      year: 2023,
      discipline: "Architecture",
      stage: "Process Documented" as const,
      critiquesReceived: 6,
      openForCritique: false,
      saved: 15,
      initials: "TH",
      featured: false,
      process: true,
    },
  ],

  contributions: {
    critiquesGiven: 34,
    critiquesRecognition: "Recognised for constructive depth by 6 peers",
    discussionsContributed: 12,
    discussionsAnchor: "2 threads started became community anchors",
    briefsCompleted: 5,
    briefsFeedback: "3 with peer feedback received",
    criticReputation: ["Constructive", "Technical", "Detailed"] as string[],
  },

  exploring: [
    { type: "Studying", topic: "Japanese joinery and timber tectonics" },
    { type: "Reading", topic: "Venturi's Complexity and Contradiction" },
    { type: "Experimenting", topic: "Grasshopper scripting for panelisation" },
  ],
  exploringThought:
    "Wondering if the section can do more work than the plan in housing. Testing this against a speculative project.",

  trainer: {
    identityAudit:
      "Your creative statement was last updated 3 months ago. Your recent work has shifted toward facades and skin studies — does your statement still reflect your core conviction?",
    growthGaps: [
      "2+ site analysis process docs (you have 0)",
      "Engagement in urban planning discussions (inactive for 6 weeks)",
      "One mentorship session requested (not yet explored)",
    ],
    opportunityReadiness: {
      score: 62,
      gaps: [
        "Process-documented housing or civic work (you have 2 of 3 needed)",
        "A stated availability status (currently set but underlinked)",
        "A Brief Board submission in the last 90 days (0 submitted)",
      ],
    },
    nextMilestone: {
      target: "Contributor",
      remaining: "2 critiques and 1 Brief Board submission",
    },
  },

  // Activity heatmap data — last 12 weeks
  activityHeatmap: {
    weeklyContributions: [
      2, 5, 3, 8, 6, 4, 7, 9, 5, 3, 6, 8, 7, 2, 4, 9, 6, 5, 8, 3,
      7, 5, 9, 4, 2, 6, 8, 3, 5, 7, 4, 8, 6, 2, 9, 5, 3, 7, 6, 4,
      8, 5, 2, 7, 9, 4, 6, 3, 5, 8, 7, 6, 4, 9, 2, 5, 3, 8, 6, 7,
      5, 4, 8, 9, 3, 6, 2, 7, 5, 4, 8, 6, 3, 9, 7, 2, 5, 4, 6, 8,
      7, 3, 9, 5, 4, 6, 2, 8, 7, 5,
    ],
    totalContributions: 543,
    averagePerWeek: 5.4,
  },
}

export type Profile = typeof PROFILE
export type ProjectStage = "Concept Only" | "WIP" | "Process Documented" | "Case Study"
export type Milestone = "student" | "practitioner" | "contributor" | "mentor"
