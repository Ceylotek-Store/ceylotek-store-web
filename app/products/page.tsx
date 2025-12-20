import ProductCard, { BackendProductType } from "@/components/ProductCard";
// Option A: Import the helper if you created 'lib/api.ts'
// import { getBaseUrl } from "@/lib/api"; 

// Option B: Define helper locally (Use this if you haven't created the file yet)
const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server-Side (Docker) -> Talk to API Container directly
    return "http://ceylotek-api:5000/api";
  }
  // Client-Side (Browser) -> Talk to Public URL (localhost)
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost/api";
};

// 1. Helper function UPDATED
async function getProducts(category?: string, search?: string): Promise<BackendProductType[]> {
  // ❌ OLD: const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // ✅ NEW: Use dynamic base URL
  const backendUrl = getBaseUrl(); 

  if (!backendUrl) {
    console.error("Backend URL could not be determined");
    return [];
  }

  // 2. Build URL with Query Params safely
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (search) params.append("search", search);

  // Note: 'backendUrl' already includes '/api' from our helper logic, 
  // but if your helper returns just the host, add '/api' here. 
  // Based on my previous code, getBaseUrl() returns ".../api", so we append "/products".
  const url = `${backendUrl}/products?${params.toString()}`;

  console.log(`[ProductsPage] Fetching from: ${url}`);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[ProductsPage] Error fetching products:", error);
    return [];
  }
}

export const metadata = {
  title: 'Products | Ceylotek.lk',
  description: 'Browse our full range of electronics.',
}

// 3. Define the Props Type correctly
interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage(props: ProductsPageProps) {

  // AWAIT the searchParams before accessing properties
  const searchParams = await props.searchParams;
  const categoryFilter = searchParams.category;
  const searchFilter = searchParams.search;

  // Pass both filters to the fetch function
  const products = await getProducts(categoryFilter, searchFilter);

  // 4. Logic for Dynamic Page Title
  let pageTitle = "All Products";
  if (categoryFilter && searchFilter) {
    pageTitle = `${categoryFilter.replace("-", " ")} matching "${searchFilter}"`;
  } else if (categoryFilter) {
    pageTitle = categoryFilter.replace("-", " ");
  } else if (searchFilter) {
    pageTitle = `Results for "${searchFilter}"`;
  }

  return (
    // Added 'relative' to establish stacking context
    <main className="min-h-screen bg-[#F9FAFB] py-12 relative overflow-hidden">

      {/* Added 'relative z-10' to ensure content floats ON TOP of the 3D background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222831] mb-2 uppercase tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-[#393E46] text-lg">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#393E46]">No products found</h2>
            <p className="text-gray-500 mt-2">
              We couldn&apos;t find any matches for your current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}