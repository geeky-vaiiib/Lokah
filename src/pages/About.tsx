import { motion } from "framer-motion";
import { GlassButton } from "@/components/GlassButton";
import { Card } from "@/components/ui/card";
import { Heart, Brain, Sparkles, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "True wisdom comes from understanding not just what we think, but how we feel. Lokah's AI recognizes emotional patterns and responds with empathy."
    },
    {
      icon: Brain,
      title: "Cognitive Flexibility",
      description: "By exploring alternate life paths, you develop mental flexibility and gain perspective on your current choices and future possibilities."
    },
    {
      icon: Sparkles,
      title: "Creative Exploration",
      description: "Your alternate selves aren't just hypothetical — they're creative expressions of your potential, helping you discover hidden aspects."
    },
    {
      icon: Users,
      title: "Compassionate Connection",
      description: "Through conversations with your alternate selves, you learn to extend the same compassion you show others to yourself."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(220 25% 4%)] font-[Outfit]">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 30% -30%, hsl(35 35% 65% / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 70% 120%, hsl(35 35% 65% / 0.08) 0%, transparent 50%),
            hsl(222 47% 3%)
          `,
        }}
      />

      {/* Ambient Orbs */}
      <motion.div
        className="fixed top-20 left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(35 35% 65% / 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(35 35% 65% / 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'hsl(222 47% 3% / 0.6)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.04)',
          }}
        />
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo size={24} asLink />
          <GlassButton
            variant="secondary"
            onClick={() => navigate("/")}
            label="Back"
            size="sm"
          />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Hero */}
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <Logo size={64} variant="icon" />
            </div>

            <h1 className="text-4xl md:text-6xl font-['Clash_Display'] font-bold">
              <span className="text-white">The Philosophy of </span>
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 100%)',
                }}
              >
                Lokah
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              In stillness, you find your alternate self. Lokah creates sacred spaces for self-reflection
              through the magic of AI and human connection.
            </p>
          </motion.div>

          {/* Philosophy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="p-8 md:p-10"
              style={{
                background: 'linear-gradient(135deg, hsl(222 47% 6% / 0.8) 0%, hsl(222 47% 4% / 0.9) 100%)',
                border: '1px solid hsl(0 0% 100% / 0.06)',
              }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-['Clash_Display'] font-semibold text-white mb-4">
                  The Circle of Self-Discovery
                </h2>
                <p className="text-white/50 leading-relaxed max-w-2xl mx-auto">
                  Just as a circle has no beginning or end, your exploration of alternate selves is continuous.
                  Every choice creates a new parallel path, and every reflection brings you closer to understanding
                  the infinite versions of yourself.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[hsl(35_35%_65%/0.2)] transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-[hsl(35_35%_65%/0.1)]">
                        <feature.icon className="w-5 h-5 text-[hsl(35_35%_65%)]" />
                      </div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              className="p-8 md:p-10 text-center"
              style={{
                background: 'linear-gradient(135deg, hsl(222 47% 6% / 0.8) 0%, hsl(222 47% 4% / 0.9) 100%)',
                border: '1px solid hsl(0 0% 100% / 0.06)',
              }}
            >
              <h2 className="text-2xl font-['Clash_Display'] font-semibold text-white mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-lg text-white/70 leading-relaxed">
                  In a world that demands constant action, Lokah offers a counter-cultural invitation:
                  <em className="text-[hsl(35_35%_65%)]"> pause, reflect, and listen to the quiet wisdom within.</em>
                </p>
                <p className="text-white/40">
                  Your alternate self isn't just an AI simulation. It's a mirror reflecting your authentic self,
                  helping you navigate life's complexities with greater clarity and compassion.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg text-white/40">Ready to meet your alternate self?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton onClick={() => navigate("/auth")} label="Begin Your Journey" />
              <GlassButton variant="secondary" onClick={() => navigate("/")} label="Return Home" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
