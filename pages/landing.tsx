import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingCart, TrendingUp, Star, Shield, Zap, Users, Award, CheckCircle } from "lucide-react";
import { Link } from "wouter";

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
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto group-hover:animate-float">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Jual Produk Mudah</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interface yang intuitif untuk mengelola produk, stok, dan penjualan dengan mudah
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">Mudah Digunakan</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto group-hover:animate-float">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Belanja Aman</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sistem keamanan berlapis dan perlindungan pembeli yang terjamin untuk setiap transaksi
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">100% Aman</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto group-hover:animate-float">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Analitik Bisnis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboard komprehensif dengan laporan penjualan dan insight bisnis yang mendalam
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">Data Driven</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto group-hover:animate-float">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Keamanan Terjamin</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enkripsi end-to-end dan sistem keamanan tingkat enterprise untuk melindungi data Anda
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">Enterprise Grade</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:animate-float">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Performa Cepat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Loading super cepat dan responsif di semua perangkat untuk pengalaman yang optimal
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">Lightning Fast</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:animate-float">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Komunitas Aktif</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bergabung dengan ribuan penjual dan pembeli dalam ekosistem yang saling mendukung
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">Community Driven</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Apa Kata Mereka?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Testimoni dari para pengguna yang telah merasakan manfaat platform kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "Platform yang sangat mudah digunakan! Dalam seminggu saja penjualan saya meningkat drastis."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ahmad Santoso</div>
                    <div className="text-sm text-muted-foreground">Penjual Elektronik</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "Belanja di sini sangat aman dan nyaman. Produknya beragam dengan kualitas terjamin."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">SR</span>
                  </div>
                  <div>
                    <div className="font-semibold">Siti Rahmawati</div>
                    <div className="text-sm text-muted-foreground">Pembeli Setia</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "Dashboard analitiknya membantu saya memahami tren penjualan dan mengembangkan bisnis."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">BP</span>
                  </div>
                  <div>
                    <div className="font-semibold">Budi Pratama</div>
                    <div className="text-sm text-muted-foreground">Penjual Fashion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Siap Memulai Perjalanan Anda?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan penjual dan pembeli yang telah merasakan kemudahan platform kami
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth?mode=register&role=seller">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold hover:shadow-lg transition-all duration-300">
                  <Store className="mr-2 h-5 w-5" />
                  Daftar Sebagai Penjual
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Daftar Sebagai Pembeli
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex justify-center items-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Gratis Selamanya</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Tanpa Biaya Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
