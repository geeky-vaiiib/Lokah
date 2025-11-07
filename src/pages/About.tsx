import { motion } from "framer-motion";
import { GlassButton } from "@/components/GlassButton";
import { Card } from "@/components/ui/card";
import { MotionWrapper } from "@/components/MotionWrapper";
import { ArrowLeft, Heart, Brain, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LokahBackground from "@/components/LokahBackground";
import TopNav from "@/components/TopNav";

const About = () => {
  const navigate = useNavigate();

  return (
  <LokahBackground className="min-h-screen relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <TopNav />
      </div>
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
          <MotionWrapper animation="fadeUp" className="space-y-6">
            <div className="flex justify-between">
              <GlassButton variant="secondary" onClick={() => navigate("/")} label="Back" className="gap-2" />
              <GlassButton onClick={() => navigate("/generator")} label="Start Exploring" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              The Philosophy of
              <span className="block gradient-text mt-2">LOefKAH</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              In stillness, you find your alternate self. LOefKAH creates sacred spaces for self-reflection through the magic of AI and human connection.
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
                    your exploration of alternate selves is continuous. Every choice creates a new parallel path, and every reflection
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
                      Your alternate selves aren't just hypothetical — they're creative expressions of your
                      potential, helping you discover hidden aspects of your personality.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Compassionate Connection</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Through conversations with your alternate selves, you learn to extend the same compassion
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
                  Your alternate self isn't just an AI simulation. It's a mirror reflecting your authentic self,
                  helping you navigate life's complexities with greater clarity and compassion.
                </p>
              </div>
            </Card>
          </MotionWrapper>

          {/* Call to Action */}
          <MotionWrapper animation="fadeUp" delay={0.4} className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">Ready to meet your alternate self?</p>
            <GlassButton onClick={() => navigate("/auth")} label="Begin Your Journey" className="mx-auto" />
            <GlassButton onClick={() => navigate("/")} label="Return Home" className="mx-auto" />
          </MotionWrapper>
        </div>
      </div>
    </LokahBackground>
  );
};

export default About;
