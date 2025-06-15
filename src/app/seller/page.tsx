'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { OrderDetailModal } from "@/components/order-detail-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { makeAPICall, formatPrice } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, ShoppingCart, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

export default function SellerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any[] | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any[] | null>(null);

  // Get user from localStorage
  const getUserFromStorage = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  const user = getUserFromStorage();

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      if (!user) return { success: false, data: [] };
      return makeAPICall(
        {
          email: user.email,
          action: "read",
        },
        "products",
      );
    },
    enabled: !!user,
  });

  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      if (!user) return { success: false, data: [] };
      return makeAPICall(
        {
          email: user.email,
          action: "read",
        },
        "orders",
      );
    },
    enabled: !!user,
  });

  const products = productsResponse?.success ? productsResponse.data : [];
  const orders = ordersResponse?.success ? ordersResponse.data : [];

  // Filter products by seller email
  const myProducts = products.filter((product: any[]) => product[1] === user?.email);
  
  // Filter orders by seller email 
  const myOrders = orders.filter((order: any[]) => {
    const sellerEmail = order[7]; // seller_id is now seller email
    return sellerEmail === user?.email;
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return makeAPICall(
        {
          email: user.email,
          productId,
          action: "delete",
        },
        "products",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produk berhasil dihapus",
        description: "Produk telah dihapus dari toko Anda.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk.",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: any[]) => {
    setEditProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleNewProduct = () => {
    setEditProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOrderClick = (order: any[]) => {
    // Find the product for this order
    const product = products.find((p: any[]) => p[0] === order[2]); // product_id
    setSelectedOrder(order);
    setIsOrderDetailModalOpen(true);
  };

  // Calculate stats
  const totalRevenue = myOrders
    .filter((order: any[]) => order[6] === "completed") // status
    .reduce((sum: number, order: any) => sum + (parseFloat(order[4]) || 0), 0); // total_price

  const activeProducts = myProducts.filter((product: any[]) => product[9] === "active").length;
  const pendingOrders = myOrders.filter((order: any[]) => order[6] === "pending").length;

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
            <h1 className="text-3xl font-bold gradient-text">Dashboard Penjual</h1>
            <p className="text-muted-foreground mt-1">
              Selamat datang, {user.name || user.email}
            </p>
          </div>
          
          <Button
            onClick={handleNewProduct}
            className="gradient-bg text-white hover:shadow-glow-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-glow transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex-1">
                <p className="text-2xl font-bold text-primary">{myProducts.length}</p>
                <p className="text-sm text-muted-foreground">Total Produk</p>
              </div>
              <Package className="h-8 w-8 text-primary/60" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex-1">
                <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
                <p className="text-sm text-muted-foreground">Produk Aktif</p>
              </div>
              <Star className="h-8 w-8 text-green-600/60" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex-1">
                <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
                <p className="text-sm text-muted-foreground">Pesanan Pending</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600/60" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex-1">
                <p className="text-2xl font-bold text-blue-600">{formatPrice(totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600/60" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
            {myOrders.length > 0 && (
              <Badge variant="secondary">{myOrders.length} pesanan</Badge>
            )}
          </div>

          {ordersLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner className="h-6 w-6" />
              <span className="ml-2">Memuat pesanan...</span>
            </div>
          ) : myOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada pesanan masuk</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myOrders.slice(0, 5).map((order: any, index: number) => {
                const product = products.find((p: any[]) => p[0] === order[2]);
                return (
                  <Card key={order[0] || index} className="cursor-pointer hover:shadow-glow transition-all duration-300" 
                        onClick={() => handleOrderClick(order)}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order[1]}</p> {/* buyer_email */}
                          <p className="text-sm text-muted-foreground">
                            {product ? product[2] : 'Produk tidak ditemukan'} - {order[3]} item
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(parseFloat(order[4]) || 0)}</p>
                        <Badge variant={order[6] === "completed" ? "default" : order[6] === "pending" ? "secondary" : "destructive"}>
                          {order[6]} {/* status */}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* My Products */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Produk Saya</h2>
            {myProducts.length > 0 && (
              <Badge variant="secondary">{myProducts.length} produk</Badge>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner className="h-6 w-6" />
              <span className="ml-2">Memuat produk...</span>
            </div>
          ) : myProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Belum ada produk</p>
                <Button onClick={handleNewProduct} className="gradient-bg text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myProducts.map((product: any, index: number) => (
                <ProductCard
                  key={product[0] || index}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditProduct(null);
        }}
        product={editProduct}
      />

      <OrderDetailModal
        isOpen={isOrderDetailModalOpen}
        onClose={() => {
          setIsOrderDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        product={selectedOrder ? products.find((p: any[]) => p[0] === selectedOrder[2]) : null}
      />
    </div>
  );
}