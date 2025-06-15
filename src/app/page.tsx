import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingCart, TrendingUp, Star, Shield, Zap, Users, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-pulse-slow">
                ✨ Platform E-Commerce Terdepan
              </Badge>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">Selamat Datang di</span>
                <span className="block gradient-text animate-gradient">UPJ Katering</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Platform marketplace modern yang menghubungkan penjual dan pembeli 
                dengan teknologi terdepan dan pengalaman yang luar biasa
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/auth?mode=register&role=seller">
                <Button size="lg" className="group gradient-bg text-white hover:shadow-glow-hover transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  <Store className="mr-2 h-5 w-5 group-hover:animate-float" />
                  Mulai Berjualan
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 transition-all duration-300 px-8 py-4 text-lg font-semibold">
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
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-muted-foreground">Pembeli Senang</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mb-4">
              Fitur Unggulan
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Mengapa Memilih <span className="gradient-text">UPJ Katering</span>?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Platform kami dilengkapi dengan fitur-fitur canggih untuk memberikan 
              pengalaman terbaik bagi penjual dan pembeli
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/15 mb-6 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Keamanan Terjamin</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sistem keamanan berlapis dengan enkripsi data dan proteksi transaksi
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/15 mb-6 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performa Cepat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Loading ultra cepat dengan teknologi modern dan optimisasi terdepan
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/15 mb-6 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Komunitas Besar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bergabung dengan ribuan penjual dan pembeli di seluruh Indonesia
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/15 mb-6 transition-colors">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analisis Mendalam</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboard analitik lengkap untuk memantau performa bisnis Anda
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/15 mb-6 transition-colors">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Kualitas Terbaik</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Kurasi produk berkualitas tinggi dengan standar internasional
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/15 mb-6 transition-colors">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Support 24/7</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tim dukungan profesional siap membantu Anda kapan saja
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Siap Memulai Perjalanan Bisnis Anda?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bergabunglah dengan ribuan merchant sukses dan rasakan pengalaman 
              e-commerce yang tak terlupakan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/auth?mode=register&role=seller">
                <Button size="lg" className="gradient-bg text-white hover:shadow-glow-hover px-8 py-4 text-lg">
                  <Store className="mr-2 h-5 w-5" />
                  Daftar Sebagai Penjual
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Daftar Sebagai Pembeli
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}