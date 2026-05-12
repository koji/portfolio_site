import ChaosBackground from '@/components/ChaosBackground';
import Navigation from '@/components/Navigation';
import PortfolioChat from '@/components/PortfolioChat';

export const ChatPage = () => {
  return (
    <div className="min-h-screen text-foreground relative">
      <ChaosBackground />
      <div className="relative z-10">
        <Navigation />
        <main className="pt-20">
          <PortfolioChat />
        </main>
      </div>
    </div>
  );
};
