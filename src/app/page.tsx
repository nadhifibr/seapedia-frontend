import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, TrendingUp, Truck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-slate-900">
            Welcome to <span className="text-primary">SEAPEDIA</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The next-generation marketplace that empowers Buyers, Sellers, and Drivers in one seamless ecosystem.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/products">
              <Button size="lg" className="h-12 px-8 text-lg">Start Shopping</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-white">Join the Platform</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">One Platform, Multiple Roles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <Store className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <CardTitle>For Sellers</CardTitle>
                <CardDescription>Open your store and reach millions.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Manage your products, process orders efficiently, and grow your income with our powerful seller tools.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <TrendingUp className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <CardTitle>For Buyers</CardTitle>
                <CardDescription>Discover the best products.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Enjoy a seamless shopping experience, track your orders in real-time, and manage your wallet easily.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <Truck className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>For Drivers</CardTitle>
                <CardDescription>Earn on your own schedule.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Find available delivery jobs, optimize your routes, and get paid instantly upon completion.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Review Placeholder */}
      <section className="bg-slate-900 py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Help Us Improve!</h2>
          <p className="text-slate-300">
            SEAPEDIA is currently in early access. We would love to hear your feedback about the application experience.
          </p>
          <Link href="/reviews">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">Leave an App Review</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
