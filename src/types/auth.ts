export type DisciplineWithSoftwares = {
  id: number;
  name: string;
  slug: string;
  softwares: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};
