import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { MotionWrapper } from "@/components/MotionWrapper";
import { ArrowLeft, Heart, Brain, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <MotionWrapper animation="fadeUp" className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </MotionWrapper>

          {/* Hero Section */}
          <MotionWrapper animation="fadeUp" delay={0.1} className="text-center space-y-6">
            <Logo variant="mark" size="lg" animated />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              The Philosophy of
              <span className="block gradient-text mt-2">LO◯KAH</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              In stillness, you find your parallel self. LO◯KAH creates sacred spaces for self-reflection through the magic of AI and human connection.
            </p>
          </MotionWrapper>

          {/* Core Philosophy */}
          <MotionWrapper animation="fadeUp" delay={0.2} className="space-y-8">
            <Card className="p-8 glass-card border-primary/20">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">The Circle of Self-Discovery</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The circular symbol (◯) in LO◯KAH represents wholeness and unity. Just as a circle has no beginning or end,
                    your journey of self-discovery is continuous. Every choice creates a new parallel path, and every reflection
                    brings you closer to understanding the infinite versions of yourself.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Emotional Intelligence</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We believe true wisdom comes from understanding not just what we think, but how we feel.
                      LO◯KAH's AI is trained to recognize emotional patterns and respond with empathy.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Cognitive Flexibility</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By exploring alternate life paths, you develop mental flexibility and gain perspective
                      on your current choices and future possibilities.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Creative Exploration</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your parallel selves aren't just hypothetical — they're creative expressions of your
                      potential, helping you discover hidden aspects of your personality.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Compassionate Connection</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Through conversations with your parallel selves, you learn to extend the same compassion
                      you show others to yourself.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </MotionWrapper>

          {/* Mission Statement */}
          <MotionWrapper animation="fadeUp" delay={0.3} className="space-y-6">
            <Card className="p-8 glass-card border-primary/20">
              <h2 className="text-2xl font-semibold mb-6 text-center">Our Mission</h2>
              <div className="space-y-4 text-center">
                <p className="text-lg leading-relaxed">
                  In a world that demands constant action and productivity, LO◯KAH offers a counter-cultural invitation:
                  <em className="text-primary"> pause, reflect, and listen to the quiet wisdom within.</em>
                </p>
                <p className="text-muted-foreground">
                  We believe that the most profound personal growth happens not through achievement,
                  but through understanding — understanding your choices, your emotions, and the infinite
                  possibilities that exist within you.
                </p>
                <p className="text-muted-foreground">
                  Your parallel self isn't just an AI simulation. It's a mirror reflecting your authentic self,
                  helping you navigate life's complexities with greater clarity and compassion.
                </p>
              </div>
            </Card>
          </MotionWrapper>

          {/* Call to Action */}
          <MotionWrapper animation="fadeUp" delay={0.4} className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              Ready to meet your parallel self?
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="gradient-primary text-white px-8 py-6 rounded-full shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Begin Your Journey
            </Button>
          </MotionWrapper>
        </div>
      </div>
    </div>
  );
};

export default About;
