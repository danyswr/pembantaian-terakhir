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
      className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
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
          className="w-full h-full flex items-center justify-center image-placeholder" 
          style={{ display: directImageUrl ? 'none' : 'flex' }}
        >
          <ImageIcon className="h-16 w-16 text-gray-400" />
        </div>
        
        {/* Interactive overlay buttons */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {!isOwner && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800"
                onClick={() => {}}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={`backdrop-blur-sm transition-colors ${isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/90 hover:bg-white text-gray-800'}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
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
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {stock <= 5 && stock > 0 && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
              Terbatas
            </Badge>
          )}
          {isOwner && (
            <Badge variant={isActive ? "default" : "secondary"} className="shadow-lg">
              {isActive ? "✓ Aktif" : "⚠ Nonaktif"}
            </Badge>
          )}
        </div>

        {/* Category badge */}
        {category && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-700 shadow-lg">
              {category}
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
              className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
              onClick={() => onEdit?.(product)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              onClick={() => onDelete?.(productId)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className={`w-full transition-all duration-300 font-semibold ${
              !isOutOfStock && isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
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
