import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Candy, ArrowRight, Sparkles, Heart, Star } from 'lucide-react';

// Import sweet images for hero display
import chocolatesImg from '@/assets/sweets/chocolates.png';
import candiesImg from '@/assets/sweets/candies.png';
import cookiesImg from '@/assets/sweets/cookies.png';
import pastriesImg from '@/assets/sweets/pastries.png';
import iceCreamImg from '@/assets/sweets/ice-cream.png';

export default function Index() {
  const { isAuthenticated } = useAuth();

  const featuredSweets = [
    { name: 'Chocolates', image: chocolatesImg },
    { name: 'Candies', image: candiesImg },
    { name: 'Pastries', image: pastriesImg },
    { name: 'Cookies', image: cookiesImg },
    { name: 'Ice Cream', image: iceCreamImg },
  ];

  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full gradient-candy flex items-center justify-center shadow-glow animate-float">
            <Candy className="w-6 h-6 text-candy-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-primary">Sweet Shop</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button asChild variant="candy">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild variant="candy">
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-10 w-20 h-20 rounded-full bg-candy/10 blur-2xl" />
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />

        <div className="max-w-4xl mx-auto text-center animate-slide-up relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-candy/10 text-candy mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Handcrafted with love</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight">
            Discover the
            <span className="block text-candy">Sweetest Treats</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From artisan chocolates to traditional favorites, explore our carefully curated collection of confectionery delights.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="candy" size="xl" className="group">
              <Link to="/auth">
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating Sweet Images */}
        <div className="mt-16 relative">
          <div className="flex justify-center items-end gap-4 md:gap-8 overflow-hidden">
            {featuredSweets.map((sweet, index) => (
              <div
                key={sweet.name}
                className="relative group"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transform: index === 2 ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <div 
                  className={`
                    w-24 h-24 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-card 
                    transition-all duration-500 group-hover:shadow-elevated group-hover:-translate-y-2
                    animate-slide-up border-2 border-border/50
                    ${index === 2 ? 'md:w-44 md:h-44' : ''}
                  `}
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <img
                    src={sweet.image}
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {sweet.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-candy" />
            <span className="font-medium">Made with Love</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            <span className="font-medium">Premium Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-medium">Fresh Daily</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Candy className="w-4 h-4 text-candy" />
            <span className="font-display font-semibold text-foreground">Sweet Shop</span>
          </div>
          <p>Your favorite confectionery destination</p>
        </div>
      </footer>
    </div>
  );
}
