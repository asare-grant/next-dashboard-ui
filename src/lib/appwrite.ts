import { Client, Account, Databases, Teams } from "appwrite";

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error("Missing Appwrite endpoint");
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

export default client;



// Since we have all these set up for the orders, i would like us to commence with the category page. Now lets proceed with the next step. Since we are done with the backend implementation and code logic, we have started  implementing them in the admin dashboard with orders page in admin done. We are going to  step by step and when we are done we will implement it in the mobile app step by step. So step one we are going to take care of the admin orders phase. these are all the codes i have for admin orders page: "use client";