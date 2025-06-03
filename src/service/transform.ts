import { fetch } from 'undici';

interface User {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  hair: { color: string };
  address: { postalCode: string };
  company: { department: string };
}

interface DepartmentSummary {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

export async function fetchAndTransformUsers(): Promise<
  Record<string, DepartmentSummary>
> {
  const res = await fetch("https://dummyjson.com/users");

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as { users: User[] };
  const users = data.users;

  const grouped: Record<string, DepartmentSummary> = {};
  const ageMap: Record<string, number[]> = {}; // 💡 เก็บอายุแยกตาม department

  for (const user of users) {
    const dept = user.company.department;

    if (!grouped[dept]) {
      grouped[dept] = {
        male: 0,
        female: 0,
        ageRange: "",
        hair: {},
        addressUser: {},
      };
      ageMap[dept] = [];
    }

    const group = grouped[dept];

    // Gender count
    user.gender === "male" ? group.male++ : group.female++;

    // Collect age
    ageMap[dept].push(user.age);

    // Hair color
    const color = user.hair.color;
    group.hair[color] = (group.hair[color] || 0) + 1;

    // Address User
    const fullName = `${user.firstName}${user.lastName}`;
    group.addressUser[fullName] = user.address.postalCode;
  }

  // Finalize ageRange
  for (const dept in grouped) {
    const ages = ageMap[dept];
    const min = Math.min(...ages);
    const max = Math.max(...ages);
    grouped[dept].ageRange = `${min}-${max}`;
  }

  return grouped;
}
