export function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-700">&copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.</p>
        <p className="mt-2 max-w-md mx-auto">
          A multi-role marketplace simulation platform supporting Buyers, Sellers, Drivers, and Admins.
        </p>
      </div>
    </footer>
  );
}
