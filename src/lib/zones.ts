export const ZONES = [
  "Joburg CBD",
  "Soweto",
  "Sandton",
  "Pretoria CBD",
  "Midrand",
  "Other",
] as const

export type Zone = (typeof ZONES)[number]
