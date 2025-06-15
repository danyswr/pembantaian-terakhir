'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export default function BuyerOrdersPage() {
  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/buyer">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Pesanan Saya</h1>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Pesanan #{i}</CardTitle>
                    <p className="text-sm text-muted-foreground">15 Juni 2025</p>
                  </div>
                  <Badge variant={i === 1 ? "default" : i === 2 ? "secondary" : "outline"}>
                    {i === 1 ? "Diproses" : i === 2 ? "Dikirim" : "Selesai"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Produk {i}</h4>
                    <p className="text-sm text-muted-foreground">Qty: 2</p>
                    <p className="font-semibold text-primary">Rp 200.000</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}