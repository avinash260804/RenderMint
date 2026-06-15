import { SearchExperience } from "@/components/forum/search-experience";
import { AppLayoutShell } from "@/components/ui-system/app-layout-shell";
import { getDisciplineList } from "@/modules/feed/server/feed-service";
import { searchQuerySchema } from "@/modules/search/schemas/search-schema";
import { searchPosts } from "@/modules/search/server/search-service";

export const revalidate = 300;

type SearchPageProps = {
  searchParams?: {
    q?: string;
    discipline?: string;
    software?: string;
    postType?: string;
    solved?: string;
    page?: string;
    pageSize?: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const disciplines = await getDisciplineList();

  const parsed = searchQuerySchema.safeParse({
    q: searchParams?.q,
    discipline: searchParams?.discipline,
    software: searchParams?.software,
    postType: searchParams?.postType,
    solved: searchParams?.solved,
    page: searchParams?.page,
    pageSize: searchParams?.pageSize ?? "24",
  });

  const initialQuery = parsed.success ? parsed.data : searchQuerySchema.parse({ pageSize: "24" });
  const initialResult = await searchPosts(initialQuery);

  return (
    <AppLayoutShell navLabel="Search" navTitle="Search the design archive">
      <SearchExperience
        disciplines={disciplines}
        initialQuery={initialQuery}
        initialResult={initialResult}
      />
    </AppLayoutShell>
  );
}
