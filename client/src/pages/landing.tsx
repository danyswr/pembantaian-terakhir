import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingCart, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div 
          className="relative h-96 rounded-2xl overflow-hidden mb-8"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-white space-y-6 max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Selamat Datang di EcoMarket
              </h1>
              <p className="text-xl md:text-2xl">
                Platform e-commerce modern untuk semua kebutuhan Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?mode=register&role=seller">
                  <Button size="lg" className="bg-primary text-white hover:bg-blue-600">
                    Mulai Berjualan
                  </Button>
                </Link>
                <Link href="/auth?mode=register&role=buyer">
                  <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                    Mulai Berbelanja
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="space-y-4 pt-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Jual Produk Mudah</h3>
            <p className="text-gray-600">
              Platform yang mudah untuk menjual produk Anda dengan fitur lengkap
            </p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="space-y-4 pt-6">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Belanja Aman</h3>
            <p className="text-gray-600">
              Sistem pemesanan yang aman dan terintegrasi untuk pengalaman berbelanja terbaik
            </p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="space-y-4 pt-6">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Kelola Bisnis</h3>
            <p className="text-gray-600">
              Dashboard lengkap untuk mengelola produk, pesanan, dan analitik bisnis
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
