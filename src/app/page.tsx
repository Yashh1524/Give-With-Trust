import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const res = await fetch(`${process.env.WEBSITE_LINK}/api/total-raised`, {
    cache: "no-store", // optional: disables caching
  });
  const { totalAmountRaised, totalNGOCount, totalUserCount } = await res.json();

  return (
    <HomePageClient
      initialAmount={totalAmountRaised}
      initialNgos={totalNGOCount}
      initialDonors={totalUserCount}
    />
  );
}
