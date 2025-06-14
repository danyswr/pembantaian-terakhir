import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { OrderDetailModal } from "@/components/order-detail-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { makeAPICall, formatPrice } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, ShoppingCart, TrendingUp, Star } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any[] | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any[] | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return makeAPICall(
        {
          email: user?.email,
          action: "delete",
          product_id: productId,
        },
        "products",
      );
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Produk berhasil dihapus!",
          description: "Produk telah dihapus dari katalog",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      } else {
        toast({
          title: "Gagal menghapus produk",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk",
        variant: "destructive",
      });
    },
  });

  const processOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      console.log("Processing order:", orderId, "with status:", status);

      const payload = {
        email: user?.email,
        action: "update",
        order_id: orderId,
        order_status: status,
      };

      console.log("Order update payload:", payload);
      const response = await makeAPICall(payload, "orders");
      console.log("Order update API response:", response);

      if (!response.success) {
        throw new Error(response.error || "Failed to update order status");
      }

      return { ...response, requestedStatus: status };
    },
    onSuccess: (response) => {
      console.log("Order update successful:", response);
      const statusText =
        response.requestedStatus === "confirmed" ? "dikonfirmasi" : "ditolak";
      toast({
        title: "Pesanan berhasil diproses!",
        description: `Status pesanan berhasil diubah menjadi ${statusText}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: any) => {
      console.error("Order update error:", error);
      toast({
        title: "Gagal memproses pesanan",
        description:
          error.message ||
          "Terjadi kesalahan saat memproses pesanan. Pastikan Google Apps Script sudah diperbarui dengan fitur update orders.",
        variant: "destructive",
      });
    },
  });

  const products = productsResponse?.success ? productsResponse.data : [];
  const orders = ordersResponse?.success ? ordersResponse.data : [];

  // Debug: Log untuk melihat data
  console.log("Seller Dashboard - Products response:", productsResponse);
  console.log("Seller Dashboard - All products:", products);
  console.log("Seller Dashboard - Orders response:", ordersResponse);
  console.log("Seller Dashboard - All orders:", orders);
  console.log("Seller Dashboard - Current user email:", user?.email);
  console.log("Seller Dashboard - Current user ID:", user?.userId);

  const currentEmail = user?.email;

  // Berdasarkan Google Apps Script, sistem sekarang menggunakan email sebagai user_id
  // Tapi produk lama mungkin masih menggunakan UUID
  // Jadi kita perlu filter berdasarkan email DAN UUID yang sudah ada

  const sellerProducts = products.filter((product: any[]) => {
    const productUserId = product[1]; // user_id is at index 1

    console.log("Filtering product:", {
      productId: product[0],
      productUserId: productUserId,
      currentEmail: currentEmail,
      productName: product[2],
    });

    // Check both email and legacy UUID for compatibility
    const legacyUserMapping: { [email: string]: string } = {
      "test@gmail.com": "287799bf-9621-4ef9-ad24-3f8e77cf1461",
      "trollpristel@gmail.com": "287799bf-9621-4e9f-ad24-3f8e77cf1461",
    };

    const isOwner =
      productUserId === currentEmail ||
      productUserId === legacyUserMapping[currentEmail || ""];

    console.log("Product ownership result:", {
      isOwner: isOwner,
      productUserId: productUserId,
      currentEmail: currentEmail,
      legacyId: legacyUserMapping[currentEmail || ""],
    });

    return isOwner;
  });

  // Filter orders for this seller
  const sellerOrders = orders.filter((order: any[]) => {
    const sellerId = order[2]; // seller_id is at index 2

    console.log("Filtering order:", {
      orderId: order[0],
      sellerId: sellerId,
      currentEmail: currentEmail,
      buyerId: order[1],
    });

    // Check both email and legacy UUID for compatibility
    const legacyUserMapping: { [email: string]: string } = {
      "test@gmail.com": "287799bf-9621-4ef9-ad24-3f8e77cf1461",
      "trollpristel@gmail.com": "287799bf-9621-4e9f-ad24-3f8e77cf1461",
    };

    const isForThisSeller =
      sellerId === currentEmail ||
      sellerId === legacyUserMapping[currentEmail || ""];

    console.log("Order ownership result:", {
      isForThisSeller: isForThisSeller,
      sellerId: sellerId,
      currentEmail: currentEmail,
      legacyId: legacyUserMapping[currentEmail || ""],
    });

    return isForThisSeller;
  });

  const stats = {
    totalProducts: sellerProducts.length,
    activeProducts: sellerProducts.filter((p: any[]) => p[8] === 1).length,
    outOfStock: sellerProducts.filter((p: any[]) => p[6] === 0).length,
    totalValue: sellerProducts.reduce(
      (sum: number, p: any[]) => sum + p[5] * p[6],
      0,
    ),
  };

  const handleAddProduct = () => {
    setEditProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: any[]) => {
    setEditProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteMutation.mutate(productId);
    }
  };

  const handleProcessOrder = (orderId: string, status: string) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin ${status === "confirmed" ? "mengkonfirmasi" : "menolak"} pesanan ini?`,
      )
    ) {
      processOrderMutation.mutate({ orderId, status });
    }
  };

  const handleViewOrderDetail = (order: any[]) => {
    setSelectedOrder(order);
    setIsOrderDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Seller</h1>
        <div className="flex space-x-4">
          <Button
            onClick={handleAddProduct}
            className="bg-success hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produk Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeProducts}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stok Habis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.outOfStock}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nilai Inventory</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {new Intl.NumberFormat("id-ID").format(stats.totalValue)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Produk Saya</h2>
          <span className="text-gray-600">{sellerProducts.length} produk</span>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada produk
            </h3>
            <p className="text-gray-600 mb-4">
              Mulai berjualan dengan menambahkan produk pertama Anda
            </p>
            <Button
              onClick={handleAddProduct}
              className="bg-success hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerProducts.map((product: any[]) => (
              <ProductCard
                key={product[0]}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Pesanan Masuk</h2>
          <span className="text-gray-600">{sellerOrders.length} pesanan</span>
        </div>

        {sellerOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada pesanan
            </h3>
            <p className="text-gray-600">
              Pesanan dari pembeli akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellerOrders.map((order: any[]) => {
              // Order structure: [order_id, user_id, seller_id, product_id, quantity, total_price, order_status, created_at, updated_at]
              const [
                orderId,
                buyerId,
                sellerId,
                productId,
                quantity,
                totalPrice,
                orderStatus,
                createdAt,
              ] = order;
              const product = products.find((p: any[]) => p[0] === productId);
              const productName = product
                ? product[2]
                : "Produk tidak ditemukan";

              return (
                <Card key={orderId}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{productName}</h3>
                          <Badge
                            variant={
                              orderStatus === "pending"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {orderStatus === "pending"
                              ? "Menunggu"
                              : orderStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pembeli: {buyerId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Jumlah: {quantity} • Total: {formatPrice(totalPrice)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrderDetail(order)}
                        >
                          Detail
                        </Button>
                        {orderStatus === "pending" && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleProcessOrder(orderId, "confirmed")
                              }
                              disabled={processOrderMutation.isPending}
                            >
                              Konfirmasi
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleProcessOrder(orderId, "cancelled")
                              }
                              disabled={processOrderMutation.isPending}
                            >
                              Tolak
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditProduct(null);
        }}
        product={editProduct}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isOrderDetailModalOpen}
        onClose={() => {
          setIsOrderDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        product={
          selectedOrder
            ? products.find((p: any[]) => p[0] === selectedOrder[3])
            : null
        }
      />
    </div>
  );
}
