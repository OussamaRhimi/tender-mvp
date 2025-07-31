import { getCurrentUser } from "@/lib/getCurrentUser";
import Navbar from "@/components/Navbar";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import TenderTable from "@/components/TenderTable";
import SearchAndFilter from "@/components/SearchAndFilter";
import { redirect } from "next/navigation";

interface SearchParams {
  title?: string;
  tag?: string;
  subtag?: string;
  location?: string; // Updated from country to location
  deadline?: string;
  email?: string;
  page?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect("/");
  }

  const userInfo = {
    firstName: typeof user?.firstName === "string" ? user.firstName : undefined,
    lastName: typeof user?.lastName === "string" ? user.lastName : undefined,
  };

  const tagId = searchParams.tag && !isNaN(parseInt(searchParams.tag)) ? parseInt(searchParams.tag) : undefined;
  const subtagId = searchParams.subtag && !isNaN(parseInt(searchParams.subtag)) ? parseInt(searchParams.subtag) : undefined;
  const page = parseInt(searchParams.page || "1");
  const tendersPerPage = 5;

  const tagFilter = tagId
    ? {
        some: {
          tagId: tagId,
        },
      }
    : undefined;

  const subtagFilter = subtagId
    ? {
        some: {
          tagId: subtagId,
        },
      }
    : undefined;

  const whereClause = {
    title: searchParams.title
      ? { contains: searchParams.title }
      : undefined,
    location: searchParams.location // Updated from country to location
      ? { contains: searchParams.location }
      : undefined,
    deadline: searchParams.deadline
      ? { gte: new Date(searchParams.deadline) }
      : undefined,
    buyer: searchParams.email
      ? {
          email: { contains: searchParams.email },
        }
      : undefined,
    tags: tagFilter || subtagFilter ? tagFilter || subtagFilter : undefined,
  };

  const [tenders, totalTenders, tags, subtags, locations] = await Promise.all([
    prisma.tender.findMany({
      where: whereClause,
      include: {
        buyer: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * tendersPerPage,
      take: tendersPerPage,
    }),
    prisma.tender.count({
      where: whereClause,
    }),
    prisma.tag.findMany({ where: { parentId: null } }),
    prisma.tag.findMany({ where: { parentId: { not: null } } }),
    prisma.tender.findMany({
      select: { location: true },
      distinct: ["location"],
      where: { location: { not: null } },
    }),
  ]);

  const totalPages = Math.ceil(totalTenders / tendersPerPage);

  const displayTenders = tenders.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    deadline: t.deadline.toISOString(),
    location: t.location ?? "Unknown",
    buyerName: `${t.buyer.firstName} ${t.buyer.lastName}`,
    tags: t.tags.map((tt) => tt.tag.name),
  }));

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {user ? <NavbarLoggedIn user={userInfo} /> : <Navbar />}

      <main className="flex-1 px-6 py-10 max-w-7xl mx-auto">
        <br />
        <h1 className="text-4xl font-bold text-center mb-10">Available Tenders</h1>

        <SearchAndFilter
          tags={tags}
          subtags={subtags}
          locations={locations} // Updated from countries to locations
        />

        <TenderTable tenders={displayTenders} />

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => {
            const url = new URLSearchParams();
            if (searchParams.title) url.set("title", searchParams.title);
            if (searchParams.tag) url.set("tag", searchParams.tag);
            if (searchParams.subtag) url.set("subtag", searchParams.subtag);
            if (searchParams.location) url.set("location", searchParams.location); // Updated from country to location
            if (searchParams.deadline) url.set("deadline", searchParams.deadline);
            if (searchParams.email) url.set("email", searchParams.email);
            url.set("page", String(i + 1));
            const queryString = url.toString();
            return (
              <a key={i} href={`/home?${queryString}`}>
                <button
                  className={`px-3 py-1 border rounded ${
                    page === i + 1 ? "bg-blue-200" : ""
                  }`}
                >
                  {i + 1}
                </button>
              </a>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}