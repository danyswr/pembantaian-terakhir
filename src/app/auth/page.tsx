'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { makeAPICall } from "@/lib/api";
import { Store, ShoppingCart, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer"
  });

  useEffect(() => {
    const mode = searchParams.get("mode");
    const role = searchParams.get("role");
    
    if (mode === "register") {
      setActiveTab("register");
      if (role && (role === "buyer" || role === "seller")) {
        setRegisterForm(prev => ({ ...prev, role }));
      }
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeAPICall({
        email: loginForm.email,
        password: loginForm.password,
        action: "login"
      }, "auth");

      if (response.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali.",
        });

        // Redirect based on role
        if (response.data.role === "buyer") {
          router.push("/buyer");
        } else {
          router.push("/seller");
        }
      } else {
        toast({
          title: "Login gagal",
          description: response.error || "Email atau password salah.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama.",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password harus minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await makeAPICall({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
        action: "register"
      }, "auth");

      if (response.success) {
        toast({
          title: "Registrasi berhasil!",
          description: "Akun Anda telah dibuat. Silakan login.",
        });
        
        setActiveTab("login");
        setLoginForm({ email: registerForm.email, password: "" });
      } else {
        toast({
          title: "Registrasi gagal",
          description: response.error || "Terjadi kesalahan saat membuat akun.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold gradient-text">
            UPJ Katering
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Platform marketplace modern untuk semua kebutuhan Anda
          </p>
        </div>

        <Card className="shadow-glow border-primary/20">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">
              {activeTab === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login" 
                ? "Masukkan email dan password untuk melanjutkan" 
                : "Isi data di bawah untuk membuat akun baru"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="nama@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-bg text-white hover:shadow-glow-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Memproses...
                      </>
                    ) : (
                      "Masuk"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button
                    type="button"
                    variant={registerForm.role === "buyer" ? "default" : "outline"}
                    className={registerForm.role === "buyer" ? "gradient-bg text-white" : ""}
                    onClick={() => setRegisterForm(prev => ({...prev, role: "buyer"}))}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pembeli
                  </Button>
                  <Button
                    type="button"
                    variant={registerForm.role === "seller" ? "default" : "outline"}
                    className={registerForm.role === "seller" ? "gradient-bg text-white" : ""}
                    onClick={() => setRegisterForm(prev => ({...prev, role: "seller"}))}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Penjual
                  </Button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        className="pl-10"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({...prev, name: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="nama@email.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        className="pl-10 pr-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Ulangi password"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({...prev, confirmPassword: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      {registerForm.role === "buyer" ? (
                        <>
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          Daftar sebagai Pembeli
                        </>
                      ) : (
                        <>
                          <Store className="mr-1 h-3 w-3" />
                          Daftar sebagai Penjual
                        </>
                      )}
                    </Badge>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-bg text-white hover:shadow-glow-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Memproses...
                      </>
                    ) : (
                      "Buat Akun"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Dengan mendaftar, Anda menyetujui{" "}
            <button className="text-primary hover:underline">
              Syarat & Ketentuan
            </button>{" "}
            dan{" "}
            <button className="text-primary hover:underline">
              Kebijakan Privasi
            </button>{" "}
            kami
          </p>
        </div>
      </div>
    </div>
  );
}