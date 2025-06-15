import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingCart, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                ✨ Platform E-Commerce Terdepan
              </Badge>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">Selamat Datang di</span>
                <span className="block text-primary">UPJ Katering</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Platform marketplace modern yang menghubungkan penjual dan pembeli 
                dengan teknologi terdepan dan pengalaman yang luar biasa
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/auth?mode=register&role=seller">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-semibold">
                  <Store className="mr-2 h-5 w-5" />
                  Mulai Berjualan
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 px-8 py-4 text-lg font-semibold">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Mulai Berbelanja
                </Button>
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-muted-foreground">Produk Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Penjual Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-muted-foreground">Transaksi Sukses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Mengapa Memilih Kami?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fitur-fitur unggulan yang membuat pengalaman jual beli Anda lebih mudah dan menyenangkan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Jual Produk Mudah</h3>
                <p className="text-muted-foreground">
                  Interface yang intuitif untuk mengelola produk, stok, dan penjualan dengan mudah
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Belanja Aman</h3>
                <p className="text-muted-foreground">
                  Sistem keamanan berlapis dan perlindungan pembeli yang terjamin untuk setiap transaksi
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Keamanan Terjamin</h3>
                <p className="text-muted-foreground">
                  Enkripsi end-to-end dan sistem keamanan tingkat enterprise untuk melindungi data Anda
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}