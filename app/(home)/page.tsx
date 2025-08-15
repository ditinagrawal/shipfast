import { db } from "@/lib/db";

const HomePage = async () => {
  const users = await db.user.findMany();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
};

export default HomePage;
