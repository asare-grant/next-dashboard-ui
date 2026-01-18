import { Client, Teams } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config(); // ✅ this loads variables from .env.local or .env

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // must be set
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const teamsClient = new Teams(client);

const ADMIN_TEAM_ID = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID;
const MANAGER_TEAM_ID = process.env.NEXT_PUBLIC_APPWRITE_MANAGER_TEAM_ID;
const STAFF_TEAM_ID = process.env.NEXT_PUBLIC_APPWRITE_STAFF_TEAM_ID;

// Map of user email → role
const userRoles = {
  "zuraiya@email.com": "admin",
  "prince@test.com": "manager",
  "babe@email.com": "staff",
};

async function assignRoles() {
  for (const [email, role] of Object.entries(userRoles)) {
    try {
      // 1️⃣ Get user by email
      const usersList = await teamsClient.client.users.list();
      const user = usersList.users.find((u) => u.email === email);
      if (!user) {
        console.log(`User not found: ${email}`);
        continue;
      }

      // 2️⃣ Determine which team
      let teamId = "";
      if (role === "admin") teamId = ADMIN_TEAM_ID;
      if (role === "manager") teamId = MANAGER_TEAM_ID;
      if (role === "staff") teamId = STAFF_TEAM_ID;

      // 3️⃣ Add user to team
      await teamsClient.createMembership(
        teamId,
        user.$id,
        [role],
        `Invitation for ${email}`
      );

      console.log(`Assigned ${email} → ${role}`);
    } catch (err) {
      console.error(`Error assigning ${email}:`, err);
    }
  }
}

assignRoles();
