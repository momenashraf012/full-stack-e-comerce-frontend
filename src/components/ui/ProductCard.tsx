import { Link } from 'react-router-dom';
import { cn } from '../../utils';
import Button from './Button';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

const ProductCard = ({
  product,
  onAddToCart,
  className,
}: ProductCardProps) => {
  return (
    <div
      className={cn(
        'group bg-surface-lowest rounded-lg overflow-hidden flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl shadow-md border border-outline-variant/10',
        className
      )}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-surface-container">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain transition-transform group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Wishlist Button can go here */}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
          <h3 className="font-headline font-semibold text-on-surface line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
        </div>
      </Link>
      <div className="px-4 pb-4 mt-auto flex items-center justify-between gap-4">
        <span className="text-xl font-bold text-primary">
          {product.price.toLocaleString()} ج.م
        </span>
        <Button
          size="sm"
          onClick={() => onAddToCart?.(product)}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
