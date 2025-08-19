const ProductShowcase = () => {
  const products = [
    {
      image: "/showcase_im1.jpg",
      title: "Complete Skincare Analysis",
      description:
        "Our AI analyzes multiple skincare products to create your perfect routine",
      category: "MULTI-PRODUCT",
    },
    {
      image: "/showcase_im2.jpg",
      title: "Precision Ingredient Detection",
      description:
        "Advanced technology identifies beneficial ingredients for your skin type",
      category: "AI POWERED",
    },
    {
      image: "/showcase_im3.jpg",
      title: "Holistic Beauty Solutions",
      description:
        "From serums to tools, we analyze everything in your beauty arsenal",
      category: "COMPREHENSIVE",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-cream overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-br from-nude-pink/10 to-champagne/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-br from-soft-taupe/15 to-rose-nude/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header with luxury styling */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-gradient-to-r from-nude-pink/20 to-champagne/20 rounded-full text-sm font-inter font-medium text-warm-gray border border-primary/20 tracking-wide">
              DISCOVER YOUR ROUTINE
            </span>
          </div>

          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-8 leading-[1.15]">
            Perfect Your
            <span className="block text-transparent bg-gradient-to-r from-primary via-nude-pink to-rose-nude bg-clip-text pb-4 pt-1">
              Beauty Ritual
            </span>
          </h2>

          <p className="font-inter text-xl text-warm-gray max-w-3xl mx-auto leading-relaxed">
            Our advanced AI technology analyzes your skincare products and
            provides personalized recommendations based on your unique skin
            profile and needs.
          </p>
        </div>

        {/* Innovative asymmetrical grid layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Large featured product */}
          <div className="lg:col-span-7 group">
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-deep group-hover:shadow-luxury transition-all duration-700">
              <img
                src={products[0].image}
                alt={products[0].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-xs font-inter font-medium mb-4 tracking-wide">
                  {products[0].category}
                </span>
                <h3 className="font-playfair text-3xl font-semibold mb-3">
                  {products[0].title}
                </h3>
                <p className="font-inter text-white/90 leading-relaxed max-w-md">
                  {products[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Stacked smaller products */}
          <div className="lg:col-span-5 space-y-8">
            {products.slice(1).map((product, index) => (
              <div key={index + 1} className="group">
                <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-luxury group-hover:shadow-deep transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <span className="inline-block px-2 py-1 bg-nude-pink/80 backdrop-blur-sm rounded-full text-xs font-inter font-medium mb-3 tracking-wide">
                        {product.category}
                      </span>
                      <h3 className="font-playfair text-xl font-semibold mb-2">
                        {product.title}
                      </h3>
                      <p className="font-inter text-white/90 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features grid with floating cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-24">
          {[
            {
              icon: "🔍",
              title: "Skin Analysis",
              desc: "Deep condition detection",
            },
            {
              icon: "🧪",
              title: "Ingredient Match",
              desc: "Perfect formulation finder",
            },
            {
              icon: "⚡",
              title: "Instant Results",
              desc: "Real-time recommendations",
            },
            {
              icon: "🔒",
              title: "Privacy First",
              desc: "Your data stays secure",
            },
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-luxury group-hover:shadow-deep group-hover:-translate-y-2 transition-all duration-500 border border-primary/10">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-inter text-warm-gray text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
