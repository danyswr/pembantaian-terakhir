import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingCart, TrendingUp, Star, Shield, Zap, Users, Award, CheckCircle, Sparkles, ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-blue-500/10 animate-gradient"></div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center space-y-8">
            <motion.div className="space-y-6" variants={itemVariants}>
              <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                <Sparkles className="w-4 h-4 mr-2" />
                Platform E-Commerce Terdepan
              </Badge>
              
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight">
                <motion.span 
                  className="block text-glow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Selamat Datang di
                </motion.span>
                <motion.span 
                  className="block gradient-text animate-gradient text-6xl sm:text-7xl lg:text-9xl mt-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  UPJ Katering
                </motion.span>
              </h1>
              
              <motion.p 
                className="max-w-4xl mx-auto text-xl sm:text-2xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Platform marketplace modern yang menghubungkan penjual dan pembeli 
                dengan teknologi terdepan dan pengalaman yang luar biasa
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
              variants={itemVariants}
            >
              <Link href="/auth?mode=register&role=seller">
                <Button size="lg" className="group gradient-bg text-white hover:shadow-glow-hover transition-all duration-300 px-10 py-6 text-lg font-semibold rounded-full hover-lift">
                  <Store className="mr-3 h-6 w-6 group-hover:animate-float" />
                  Mulai Berjualan
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 px-10 py-6 text-lg font-semibold rounded-full hover-lift">
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Mulai Berbelanja
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto"
              variants={itemVariants}
            >
              {[
                { number: "1000+", label: "Produk Tersedia", icon: Store },
                { number: "500+", label: "Penjual Aktif", icon: Users },
                { number: "5000+", label: "Transaksi Sukses", icon: CheckCircle }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-6 rounded-2xl card-modern hover-lift"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-background to-muted/30">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center space-y-6 mb-20" variants={itemVariants}>
            <Badge variant="outline" className="px-4 py-2 text-primary border-primary/20">
              Fitur Unggulan
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold gradient-text">Mengapa Memilih Kami?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Fitur-fitur unggulan yang membuat pengalaman jual beli Anda lebih mudah dan menyenangkan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Store,
                title: "Jual Produk Mudah",
                description: "Interface yang intuitif untuk mengelola produk, stok, dan penjualan dengan mudah",
                badge: "Mudah Digunakan",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: ShoppingCart,
                title: "Belanja Aman",
                description: "Sistem keamanan berlapis dan perlindungan pembeli yang terjamin untuk setiap transaksi",
                badge: "100% Aman",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: TrendingUp,
                title: "Analitik Bisnis",
                description: "Dashboard komprehensif dengan laporan penjualan dan insight bisnis yang mendalam",
                badge: "Data Driven",
                gradient: "from-amber-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Keamanan Terjamin",
                description: "Enkripsi end-to-end dan sistem keamanan tingkat enterprise untuk melindungi data Anda",
                badge: "Enterprise Grade",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Performa Cepat",
                description: "Loading super cepat dan responsif di semua perangkat untuk pengalaman yang optimal",
                badge: "Lightning Fast",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Komunitas Aktif",
                description: "Bergabung dengan ribuan penjual dan pembeli dalam ekosistem yang saling mendukung",
                badge: "Community Driven",
                gradient: "from-indigo-500 to-blue-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="group interactive-card border-0 card-modern h-full">
                  <CardContent className="p-8 text-center space-y-6 h-full flex flex-col">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                      {feature.badge}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gradient-to-b from-muted/30 to-background">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center space-y-6 mb-20" variants={itemVariants}>
            <Badge variant="outline" className="px-4 py-2 text-primary border-primary/20">
              Testimoni
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold gradient-text">Apa Kata Mereka?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Testimoni dari para pengguna yang telah merasakan manfaat platform kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmad Santoso",
                role: "Penjual Elektronik",
                content: "Platform yang sangat mudah digunakan! Dalam seminggu saja penjualan saya meningkat drastis.",
                avatar: "AS",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                name: "Siti Rahmawati",
                role: "Pembeli Setia",
                content: "Belanja di sini sangat aman dan nyaman. Produknya beragam dengan kualitas terjamin.",
                avatar: "SR",
                gradient: "from-pink-500 to-red-500"
              },
              {
                name: "Budi Pratama",
                role: "Penjual Fashion",
                content: "Dashboard analitiknya membantu saya memahami tren penjualan dan mengembangkan bisnis.",
                avatar: "BP",
                gradient: "from-green-500 to-teal-500"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 card-modern hover-lift h-full">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-primary font-medium">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-white">
                Siap Memulai Perjalanan Anda?
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Bergabunglah dengan ribuan penjual dan pembeli yang telah merasakan kemudahan platform kami
              </p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
              variants={itemVariants}
            >
              <Link href="/auth?mode=register&role=seller">
                <Button size="lg" variant="secondary" className="px-10 py-6 text-lg font-semibold hover:shadow-xl transition-all duration-300 rounded-full hover-lift">
                  <Store className="mr-3 h-6 w-6" />
                  Daftar Sebagai Penjual
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-6 text-lg font-semibold transition-all duration-300 rounded-full hover-lift">
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Daftar Sebagai Pembeli
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/90"
              variants={itemVariants}
            >
              {[
                { icon: CheckCircle, text: "Gratis Selamanya" },
                { icon: CheckCircle, text: "Tanpa Biaya Setup" },
                { icon: CheckCircle, text: "Support 24/7" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}