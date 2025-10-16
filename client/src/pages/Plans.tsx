import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';
import Header from '@/components/Header';

interface PlanFeature { label: string; value: string }
interface Plan {
  id: number;
  name: string;
  imageUrl: string;
  price: string;
  discount?: string | null;
  isActive: boolean;
  features: PlanFeature[];
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getPlanFeatures = (index: number) => {
    const features = [
      [
        'Access to celebrity style guides',
        'Basic outfit recommendations',
        'Monthly style tips',
        'Community access'
      ],
      [
        'Everything in Basic',
        'Personalized style analysis',
        'Weekly outfit suggestions',
        'Priority customer support',
        'Exclusive celebrity interviews'
      ],
      [
        'Everything in Premium',
        'Personal stylist consultation',
        'Custom outfit creation',
        '24/7 VIP support',
        'Early access to new features',
        'Celebrity meet & greet opportunities'
      ]
    ];
    return features[index % features.length] || features[0];
  };

  const getPlanIcon = (index: number) => {
    const icons = [Star, Crown, Zap];
    const Icon = icons[index % icons.length] || Star;
    return <Icon className="h-6 w-6" />;
  };

  const getPlanName = (index: number) => {
    const names = ['Basic', 'Premium', 'VIP'];
    return names[index % names.length] || 'Plan';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Style Plan</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock exclusive access to celebrity fashion insights, personalized style recommendations, 
            and premium features tailored to elevate your fashion game.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.filter(p => p.isActive).map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${index === 1 ? 'lg:scale-105 lg:z-10' : ''}`}
            >
              <Card className={`h-full bg-white/5 backdrop-blur-sm border-white/10 hover:border-amber-500/50 transition-all duration-300 ${
                index === 1 ? 'border-amber-500/30 shadow-2xl shadow-amber-500/20' : ''
              }`}>
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center text-amber-400">
                    {getPlanIcon(index)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name || 'Plan'}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    {plan.discount && (
                      <Badge variant="destructive" className="text-xs">
                        {plan.discount}
                      </Badge>
                    )}
                    <div className="text-4xl font-bold text-white">
                      {plan.price}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">per month</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Plan Image */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={plan.imageUrl}
                      alt={`${plan.name || 'Plan'} Plan`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik04NyA0OEw5MyA1NEw4NyA2MEw4MSA1NEw4NyA0OFoiIGZpbGw9IiM2QjcyODAiLz4KPHRleHQgeD0iMTAwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QbGFuIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    {(Array.isArray(plan.features) ? plan.features : []).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature.label}{feature.value ? `: ${feature.value}` : ''}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      index === 1 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-500/50'
                    }`}
                  >
                    {index === 1 ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {plans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Plans Available</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We're working on creating amazing subscription plans for you. 
              Check back soon for exclusive celebrity style access!
            </p>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            Questions? We've got answers.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-300">
                We offer a 7-day free trial for all new users to explore our premium features.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}