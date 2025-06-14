import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { makeAPICall } from "@/lib/api";
import { insertUserSchema, loginUserSchema, type InsertUser, type LoginUser } from "@shared/schema";
import { useLocation } from "wouter";

export default function Auth() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Get mode and role from URL params
  const params = new URLSearchParams(location.split('?')[1]);
  const initialMode = params.get('mode') || 'login';
  const initialRole = params.get('role') || '';
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode as 'login' | 'register');

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      nomorHp: "",
      jurusan: "",
      role: initialRole as "buyer" | "seller" || undefined,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      return makeAPICall({
        action: 'login',
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        const userData = {
          userId: response.data?.userId || response.userId || loginForm.getValues('email'),
          email: response.data?.email || loginForm.getValues('email'),
          fullName: response.data?.fullName || loginForm.getValues('email'),
          nomorHp: response.data?.nomorHp || "",
          jurusan: response.data?.jurusan || "",
          role: response.data?.role || response.role as "buyer" | "seller",
          createdAt: response.data?.createdAt || new Date().toISOString(),
          updatedAt: response.data?.updatedAt || new Date().toISOString(),
        };
        
        login(userData);
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali",
        });
        
        navigate(response.role === "buyer" ? "/buyer" : "/seller");
      } else {
        toast({
          title: "Login gagal",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Login gagal",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      return makeAPICall({
        action: 'register',
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        nomorHp: data.nomorHp,
        jurusan: data.jurusan,
        role: data.role,
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        const userData = response.data || {
          userId: response.userId || registerForm.getValues('email'),
          email: registerForm.getValues('email'),
          fullName: registerForm.getValues('fullName'),
          nomorHp: registerForm.getValues('nomorHp'),
          jurusan: registerForm.getValues('jurusan'),
          role: registerForm.getValues('role'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        login(userData);
        toast({
          title: "Registrasi berhasil!",
          description: "Akun berhasil dibuat. Selamat datang!",
        });
        
        // Redirect based on role
        if (response.redirect) {
          navigate(response.redirect);
        } else {
          navigate(userData.role === "buyer" ? "/buyer" : "/seller");
        }
      } else {
        toast({
          title: "Registrasi gagal",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mode === 'login' ? (
            <form onSubmit={onLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register('email')}
                  error={loginForm.formState.errors.email?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Memproses..." : "Masuk"}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-primary font-medium hover:underline"
                >
                  Daftar disini
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={onRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    {...registerForm.register('fullName')}
                    error={registerForm.formState.errors.fullName?.message}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomorHp">No. HP</Label>
                  <Input
                    id="nomorHp"
                    type="tel"
                    {...registerForm.register('nomorHp')}
                    error={registerForm.formState.errors.nomorHp?.message}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm.register('email')}
                  error={registerForm.formState.errors.email?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm.register('password')}
                  error={registerForm.formState.errors.password?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurusan">Jurusan</Label>
                <Input
                  id="jurusan"
                  {...registerForm.register('jurusan')}
                  error={registerForm.formState.errors.jurusan?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Daftar Sebagai</Label>
                <Select
                  value={registerForm.watch('role')}
                  onValueChange={(value) => registerForm.setValue('role', value as "buyer" | "seller")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Pembeli</SelectItem>
                    <SelectItem value="seller">Penjual</SelectItem>
                  </SelectContent>
                </Select>
                {registerForm.formState.errors.role && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.role.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Memproses..." : "Daftar"}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary font-medium hover:underline"
                >
                  Masuk disini
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
