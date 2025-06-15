'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search } from "lucide-react";
import Link from "next/link";

export default function BuyerPage() {
  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Pembeli</h1>
          <Link href="/buyer/orders">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Pesanan Saya
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari produk..." 
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <CardTitle className="text-lg">Produk {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Deskripsi produk yang menarik</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">Rp 100.000</span>
                  <Button size="sm">Pesan</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}