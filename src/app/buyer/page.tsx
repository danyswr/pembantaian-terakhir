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
import { makeAPICall } from "@/lib/api";
import { ShoppingBag, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

export default function BuyerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orderProduct, setOrderProduct] = useState<any[] | null>(null);

  // Get user from localStorage
  const getUserFromStorage = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  const user = getUserFromStorage();

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

    // Only show active products
    filtered = filtered.filter((product: any[]) => product[9] === "active");

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const handleOrder = (product: any[]) => {
    setOrderProduct(product);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Silakan login terlebih dahulu</h2>
          <Link href="/auth">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard Pembeli</h1>
            <p className="text-muted-foreground mt-1">
              Selamat datang, {user.name || user.email}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/buyer/orders">
              <Button variant="outline" className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Pesanan Saya</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Semua Kategori" />
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-primary">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total Produk</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-primary">{filteredProducts.length}</div>
            <div className="text-sm text-muted-foreground">Produk Tersedia</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-primary">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Kategori</div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner className="h-8 w-8" />
            <span className="ml-2">Memuat produk...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchQuery || selectedCategory 
                ? "Tidak ada produk yang sesuai dengan pencarian"
                : "Belum ada produk tersedia"
              }
            </div>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
                className="mt-2"
              >
                Tampilkan semua produk
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product[0] || index}
                product={product}
                onOrder={handleOrder}
                isOwner={false}
              />
            ))}
          </div>
        )}

        {/* Filter badges */}
        {(searchQuery || selectedCategory) && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Pencarian: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 text-xs hover:text-foreground"
                >
                  ✕
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Kategori: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="ml-1 text-xs hover:text-foreground"
                >
                  ✕
                </button>
              </Badge>
            )}
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
  );
}