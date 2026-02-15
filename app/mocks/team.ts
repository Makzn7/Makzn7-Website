import type { Person } from "~/types/person";

export const team: Person[] = [
  {
    id: 1,
    name: "Mohammed Gahaf",
    title: "Full Stack Engineer",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop",
    departmentIds: [1],
  },
  {
    id: 2,
    name: "Sara Alharbi",
    title: "Art Director",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop",
    departmentIds: [1, 4],
  },
  {
    id: 3,
    name: "Fahad Alotaibi",
    title: "Production Designer",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop",
    departmentIds: [1, 3],
  },
  {
    id: 4,
    name: "Lama Alqahtani",
    title: "Set Designer",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
    departmentIds: [2],
  },
  {
    id: 5,
    name: "Noura Almutairi",
    title: "Props Supervisor",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
    departmentIds: [2],
  },
  {
    id: 6,
    name: "Abdullah Alzahrani",
    title: "Fabrication Lead",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    departmentIds: [4],
  },
  {
    id: 7,
    name: "Hanan Alqahtani",
    title: "Costume Designer",
    photo:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop",
    departmentIds: [3],
  },
  {
    id: 8,
    name: "Khalid Alshammari",
    title: "Graphic Designer",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    departmentIds: [1, 4],
  },
];
