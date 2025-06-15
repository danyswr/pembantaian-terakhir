import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { OrderModal } from "@/components/order-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/auth";
import { makeAPICall } from "@/lib/api";
import { ShoppingBag, RefreshCw, Search, Filter, Grid, List, TrendingUp, Package, Star } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orderProduct, setOrderProduct] = useState<any[] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const { data: productsResponse, isLoading, refetch } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      if (!user) return { success: false, data: [] };
      return makeAPICall({
        email: user.email,
        action: 'read'
      }, 'products');
    },
    enabled: !!user,
  });

  const products = productsResponse?.success ? productsResponse.data : [];
  const categories = Array.from(new Set(products.map((product: any[]) => product[7]).filter(Boolean))) as string[];

  const filteredProducts = useMemo(() => {
    let filtered = products || [];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product: any[]) =>
        product[2]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product[4]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product: any[]) => product[7] === selectedCategory);
    }

    // Filter out inactive products and products from current user
    filtered = filtered.filter((product: any[]) => 
      product[8] === 1 && product[1] !== user?.email
    );

    return filtered;
  }, [products, searchQuery, selectedCategory, user?.email]);

  const handleOrder = (product: any[]) => {
    setOrderProduct(product);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="space-y-8 pb-20">
        {/* Modern Header with glass morphism */}
        <div className="relative overflow-hidden glass rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="absolute inset-0 gradient-bg opacity-90"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Dashboard Pembeli
                  </Badge>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    Selamat Datang, {user?.fullName || "Pembeli"}
                  </h1>
                  <p className="text-white/90 text-lg">
                    Temukan produk terbaik untuk kebutuhan Anda
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{user?.jurusan || 'Universitas'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/orders">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="glass text-white border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Pesanan Saya
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="glass text-white border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Search and Filter Section */}
        <div className="glass rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cari Produk
              </label>
              <div className="relative">
                <Input
                  placeholder="Ketik nama produk atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 h-12 bg-background/50 border-border/30 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
            </div>
            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-foreground mb-2">
                Kategori
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 bg-background/50 border-border/30 rounded-xl">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      📂 {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Produk</p>
                <p className="text-3xl font-bold text-foreground">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kategori Tersedia</p>
                <p className="text-3xl font-bold text-foreground">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hasil Pencarian</p>
                <p className="text-3xl font-bold text-foreground">{filteredProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground">Katalog Produk</h2>
            <div className="text-sm text-muted-foreground glass px-4 py-2 rounded-xl border border-white/20">
              Menampilkan {filteredProducts.length} produk
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass rounded-3xl p-12 shadow-xl max-w-md mx-auto border border-white/20">
                <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6 animate-float" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {searchQuery || selectedCategory ? "Tidak ada produk yang sesuai" : "Belum ada produk tersedia"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory 
                    ? "Coba ubah kata kunci pencarian atau kategori" 
                    : "Tunggu penjual menambahkan produk baru"}
                </p>
                {(searchQuery || selectedCategory) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-6 py-2 rounded-xl"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product: any[]) => (
                <ProductCard
                  key={product[0]}
                  product={product}
                  onOrder={handleOrder}
                />
              ))}
            </div>
          )}
        </div>

        {/* Order Modal */}
        <OrderModal
          isOpen={!!orderProduct}
          onClose={() => setOrderProduct(null)}
          product={orderProduct}
        />
      </div>
    </div>
  );
}