import { WebsiteCard } from "./WebsiteCard";

// Données temporaires pour la démonstration
const websites = [
  {
    id: 1,
    url: "https://example.com",
    status: "up" as const,
    lastChecked: new Date(),
  },
  {
    id: 2,
    url: "https://test.com",
    status: "down" as const,
    lastChecked: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
];

export const WebsiteList = () => {
  return (
    <div className="space-y-4">
      {websites.map((website) => (
        <WebsiteCard
          key={website.id}
          url={website.url}
          status={website.status}
          lastChecked={website.lastChecked}
        />
      ))}
    </div>
  );
};