'use client';

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
import { ShoppingBag, RefreshCw, Search, Package2, Tag } from "lucide-react";
import Link from "next/link";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orderProduct, setOrderProduct] = useState<any[] | null>(null);

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
                    <ShoppingBag className="h-4 w-4" />
                    <span>Mode Belanja</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/orders">
                  <Button 
                    variant="outline" 
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Pesanan Saya
                  </Button>
                </Link>
                <Button
                  onClick={() => refetch()}
                  disabled={isLoading}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari produk atau deskripsi..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12 border-2 border-primary/20 focus:border-primary/40 rounded-xl"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-64 h-12 border-2 border-primary/20 focus:border-primary/40 rounded-xl">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  <Search className="h-3 w-3" />
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ✕
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  📂 {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ✕
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
                className="h-auto py-1 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Produk</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <ShoppingBag className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Produk Tersedia</p>
                <p className="text-3xl font-bold">{filteredProducts.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Package2 className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Kategori</p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Tag className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pencarian</p>
                <p className="text-3xl font-bold">{searchQuery ? "1" : "0"}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Search className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">Memuat produk...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-muted-foreground">
                {searchQuery || selectedCategory 
                  ? "Tidak ada produk yang sesuai dengan pencarian"
                  : "Belum ada produk tersedia"
                }
              </h3>
              {(searchQuery || selectedCategory) && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  className="mt-4"
                >
                  Tampilkan Semua Produk
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Produk Tersedia ({filteredProducts.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product: any, index: number) => (
                  <ProductCard
                    key={product[0] || index}
                    product={product}
                    onOrder={handleOrder}
                    isOwner={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={!!orderProduct}
        onClose={() => setOrderProduct(null)}
        product={orderProduct}
      />
    </div>
  );
}