import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/api";
import { ImageIcon, Edit, Trash2, ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: any[]; // Array format from Google Sheets
  onOrder?: (product: any[]) => void;
  onEdit?: (product: any[]) => void;
  onDelete?: (productId: string) => void;
  isOwner?: boolean;
}

export function ProductCard({ product, onOrder, onEdit, onDelete, isOwner = false }: ProductCardProps) {
  // Product array structure: [product_id, user_id, product_name, image_url, description, price, stock, category, status, created_at, updated_at]
  const [productId, userId, productName, imageUrl, description, price, stock, category, status] = product;
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOutOfStock = stock === 0;
  const isActive = status === 1;

  // Convert Google Drive shareable link to thumbnail URL for better compatibility
  const getDirectImageUrl = (url: string) => {
    if (!url) return '';
    
    // Check if it's a Google Drive link and extract file ID
    if (url.includes('drive.google.com')) {
      let fileId = '';
      
      // Extract file ID from various Google Drive URL formats
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        fileId = fileIdMatch[1];
      } else {
        // Handle direct ID extraction from export URL
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (idMatch) {
          fileId = idMatch[1];
        }
      }
      
      if (fileId) {
        // Use thumbnail URL which has better CORS support
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
      }
    }
    
    return url;
  };

  const directImageUrl = getDirectImageUrl(imageUrl);

  return (
    <Card 
      className="group relative overflow-hidden neumorphism perspective-card ultra-smooth animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {!isActive && (
          <Badge variant="secondary" className="bg-gray-500/90 text-white">
            Tidak Aktif
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="destructive" className="bg-red-500/90 text-white">
            Stok Habis
          </Badge>
        )}
        {stock > 0 && stock <= 5 && (
          <Badge variant="destructive" className="bg-orange-500/90 text-white">
            Stok Terbatas
          </Badge>
        )}
      </div>

      {/* Favorite button */}
      {!isOwner && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 z-10 w-12 h-12 neumorphism ${isLiked ? 'text-red-500 animate-heartbeat neumorphism-pressed' : 'text-muted-foreground'} ultra-smooth`}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
      )}
      
      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden rounded-t-2xl">
        {directImageUrl ? (
          <img 
            src={directImageUrl} 
            alt={productName} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              console.log('Image load error for URL:', directImageUrl);
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder') as HTMLElement;
              if (placeholder) {
                placeholder.style.display = 'flex';
              }
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', directImageUrl);
              const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder') as HTMLElement;
              if (placeholder) {
                placeholder.style.display = 'none';
              }
            }}
            referrerPolicy="no-referrer"
          />
        ) : null}
        
        <div 
          className="w-full h-full flex items-center justify-center image-placeholder bg-gradient-to-br from-muted/50 to-muted" 
          style={{ display: directImageUrl ? 'none' : 'flex' }}
        >
          <ImageIcon className="h-16 w-16 text-muted-foreground" />
        </div>
        
        {/* Interactive overlay buttons */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6 gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {!isOwner && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="card-modern hover-lift button-glow text-gray-800 animate-scale-in"
                onClick={() => {}}
              >
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Preview</span>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={`card-modern button-glow transition-all duration-300 ${isLiked ? 'bg-red-500/90 hover:bg-red-600 text-white animate-bounce-subtle' : 'text-gray-800'}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{isLiked ? 'Liked' : 'Like'}</span>
              </Button>
            </>
          )}
        </div>
        
        {/* Stock out overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              Stok Habis
            </div>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {stock <= 5 && stock > 0 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl animate-glow-pulse">
              ⚡ Terbatas
            </Badge>
          )}
          {isOwner && (
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={`shadow-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-shimmer' : 'bg-gray-400'}`}
            >
              {isActive ? "✓ Aktif" : "⚠ Nonaktif"}
            </Badge>
          )}
        </div>

        {/* Category badge */}
        {category && (
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="card-modern border-white/30 text-gray-700 shadow-xl hover-lift">
              📂 {category}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {productName}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {description || "Tidak ada deskripsi"}
          </p>
        </div>
        
        {/* Price section with attractive styling */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {formatPrice(price)}
              </span>
              <div className="text-xs text-gray-500">Per item</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {stock} tersisa
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-1 w-16 mt-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    stock > 10 ? "bg-green-500" : stock > 5 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rating stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>
        
        {/* Action buttons */}
        {isOwner ? (
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 button-glow hover-lift border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 hover:border-blue-400 transition-all duration-300"
              onClick={() => onEdit?.(product)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 button-glow hover-lift text-red-600 border-red-200 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-400 transition-all duration-300"
              onClick={() => onDelete?.(productId)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className={`w-full button-glow font-semibold transition-all duration-500 ${
              !isOutOfStock && isActive
                ? "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl hover-lift animate-shimmer"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
            onClick={() => onOrder?.(product)}
            disabled={isOutOfStock || !isActive}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isOutOfStock ? "Stok Habis" : !isActive ? "Tidak Tersedia" : "Beli Sekarang"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
