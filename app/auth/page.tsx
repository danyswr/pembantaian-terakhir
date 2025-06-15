'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === 'login' ? 'Masuk' : 'Daftar'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input id="fullName" placeholder="Masukkan nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomorHp">Nomor HP</Label>
                <Input id="nomorHp" type="tel" placeholder="Masukkan nomor HP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurusan">Jurusan</Label>
                <Input id="jurusan" placeholder="Masukkan jurusan" />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Masukkan email" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Masukkan password" />
          </div>

          <Button className="w-full" size="lg">
            {mode === 'login' ? 'Masuk' : 'Daftar'}
          </Button>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}