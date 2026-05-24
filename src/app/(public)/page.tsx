import {
  HeroSection,
  CategoriesSection,
  BenefitsSection,
  StorySection,
  CtaSection,
} from "@/components/home/HomeSections";
import { getCategories } from "@/lib/data/products";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <BenefitsSection />
      <StorySection />
      <CtaSection />
    </>
  );
}
