'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function ResetPasswordConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const confirmationUrl = searchParams.get('confirmation_url');

  useEffect(() => {
    if (confirmationUrl) {
      // Directly redirect the user to the Supabase confirmation URL
      window.location.href = confirmationUrl;
    } else {
      // Handle missing confirmation URL - maybe redirect to an error page or login
      console.error("Confirmation URL not found in query parameters.");
      // Optionally redirect to an error page or back to the reset password request page
      // router.push('/reset-password?error=invalid_link');
      // For now, redirecting back to request page:
      router.push('/reset-password');
    }
    // We only want this effect to run once when the component mounts and confirmationUrl is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmationUrl, router]); // Add router to dependencies

  // Display a loading state while the redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card/50 backdrop-blur-sm">
        <div className="text-center">
          <a href="/" className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Datalinc.io
          </a>
          <h2 className="text-2xl font-bold mt-4">Confirming your request...</h2>
          <p className="mt-2 text-sm text-muted-foreground">You are being redirected to confirm your password reset.</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 mt-8">
          <LoadingSpinner size={48} />
          <p className="text-muted-foreground">Confirming your request...</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95">
        <div className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size={48} />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordConfirmContent />
    </Suspense>
  );
} 