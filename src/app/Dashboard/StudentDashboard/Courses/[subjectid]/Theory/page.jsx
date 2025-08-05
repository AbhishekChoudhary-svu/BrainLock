"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Brain, MessageCircle, Search, Send, User, Bot, Loader2, AlertCircle } from "lucide-react"

// Mock theory content for subjects
const mockTheoryContent = {
  mathematics: {
    title: "Advanced Mathematics: Calculus & Algebra",
    content: `
      <p class="mb-4">Welcome to the Advanced Mathematics theory section. Here, we will delve into the intricate world of Calculus and Linear Algebra, building upon foundational concepts to tackle more complex problems.</p>
      
      <h3 class="text-xl font-semibold mb-3">I. Calculus: The Study of Change</h3>
      <p class="mb-2">Calculus is a branch of mathematics focused on limits, functions, derivatives, integrals, and infinite series. It has two major branches: differential calculus and integral calculus.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Differential Calculus:</strong> Deals with rates of change and slopes of curves. Key concepts include limits, continuity, and differentiation rules (power rule, product rule, chain rule).</li>
        <li><strong>Integral Calculus:</strong> Deals with accumulation of quantities and areas under curves. Key concepts include antiderivatives, definite and indefinite integrals, and techniques of integration (substitution, integration by parts).</li>
      </ul>
      <p class="mb-4">Applications of calculus are vast, ranging from physics and engineering to economics and biology. It allows us to model dynamic systems and predict their behavior over time.</p>

      <h3 class="text-xl font-semibold mb-3">II. Linear Algebra: The Mathematics of Data</h3>
      <p class="mb-2">Linear Algebra is the study of vectors, vector spaces (also called linear spaces), linear transformations, and systems of linear equations. It is fundamental to modern mathematics and its applications.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Vectors and Vector Spaces:</strong> Understanding vectors as quantities with both magnitude and direction, and vector spaces as collections of vectors that can be added together and multiplied by scalars.</li>
        <li><strong>Matrices:</strong> Rectangular arrays of numbers, symbols, or expressions, arranged in rows and columns. Matrices are used to represent linear transformations, solve systems of equations, and store data.</li>
        <li><strong>Determinants:</strong> A scalar value that can be computed from the elements of a square matrix. It provides information about the properties of the matrix, such as invertibility.</li>
        <li><strong>Eigenvalues and Eigenvectors:</strong> Special vectors that are only scaled by a linear transformation, without changing direction. They are crucial in many areas, including principal component analysis (PCA) and quantum mechanics.</li>
      </ul>
      <p class="mb-4">Linear algebra is the language of data science, machine learning, and computer graphics. Its concepts are essential for understanding algorithms that process and analyze large datasets.</p>

      <h3 class="text-xl font-semibold mb-3">III. Interconnections and Advanced Topics</h3>
      <p class="mb-4">While seemingly distinct, calculus and linear algebra often intersect. For instance, multivariable calculus uses concepts from linear algebra to describe derivatives and integrals in higher dimensions. Advanced topics include differential equations, numerical methods, and optimization, all of which leverage tools from both fields.</p>
      <p class="mb-4">Mastering these subjects requires consistent practice, a deep understanding of theoretical principles, and the ability to apply them to diverse problems. Utilize the AI assistant to clarify concepts and the search bar to quickly find information within this theory.</p>
    `,
    title: "Advanced Mathematics: Calculus & Algebra",
    content: `
      <p class="mb-4">Welcome to the Advanced Mathematics theory section. Here, we will delve into the intricate world of Calculus and Linear Algebra, building upon foundational concepts to tackle more complex problems.</p>
      
      <h3 class="text-xl font-semibold mb-3">I. Calculus: The Study of Change</h3>
      <p class="mb-2">Calculus is a branch of mathematics focused on limits, functions, derivatives, integrals, and infinite series. It has two major branches: differential calculus and integral calculus.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Differential Calculus:</strong> Deals with rates of change and slopes of curves. Key concepts include limits, continuity, and differentiation rules (power rule, product rule, chain rule).</li>
        <li><strong>Integral Calculus:</strong> Deals with accumulation of quantities and areas under curves. Key concepts include antiderivatives, definite and indefinite integrals, and techniques of integration (substitution, integration by parts).</li>
      </ul>
      <p class="mb-4">Applications of calculus are vast, ranging from physics and engineering to economics and biology. It allows us to model dynamic systems and predict their behavior over time.</p>

      <h3 class="text-xl font-semibold mb-3">II. Linear Algebra: The Mathematics of Data</h3>
      <p class="mb-2">Linear Algebra is the study of vectors, vector spaces (also called linear spaces), linear transformations, and systems of linear equations. It is fundamental to modern mathematics and its applications.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Vectors and Vector Spaces:</strong> Understanding vectors as quantities with both magnitude and direction, and vector spaces as collections of vectors that can be added together and multiplied by scalars.</li>
        <li><strong>Matrices:</strong> Rectangular arrays of numbers, symbols, or expressions, arranged in rows and columns. Matrices are used to represent linear transformations, solve systems of equations, and store data.</li>
        <li><strong>Determinants:</strong> A scalar value that can be computed from the elements of a square matrix. It provides information about the properties of the matrix, such as invertibility.</li>
        <li><strong>Eigenvalues and Eigenvectors:</strong> Special vectors that are only scaled by a linear transformation, without changing direction. They are crucial in many areas, including principal component analysis (PCA) and quantum mechanics.</li>
      </ul>
      <p class="mb-4">Linear algebra is the language of data science, machine learning, and computer graphics. Its concepts are essential for understanding algorithms that process and analyze large datasets.</p>

      <h3 class="text-xl font-semibold mb-3">III. Interconnections and Advanced Topics</h3>
      <p class="mb-4">While seemingly distinct, calculus and linear algebra often intersect. For instance, multivariable calculus uses concepts from linear algebra to describe derivatives and integrals in higher dimensions. Advanced topics include differential equations, numerical methods, and optimization, all of which leverage tools from both fields.</p>
      <p class="mb-4">Mastering these subjects requires consistent practice, a deep understanding of theoretical principles, and the ability to apply them to diverse problems. Utilize the AI assistant to clarify concepts and the search bar to quickly find information within this theory.</p>
    `,
  },
  physics: {
    title: "Physics Fundamentals: Mechanics & Electromagnetism",
    content: `
      <p class="mb-4">Welcome to the Physics Fundamentals theory section. This course will introduce you to the core principles governing the physical world, focusing on classical mechanics and the basics of electromagnetism.</p>
      
      <h3 class="text-xl font-semibold mb-3">I. Classical Mechanics: The World in Motion</h3>
      <p class="mb-2">Classical mechanics describes the motion of macroscopic objects, from projectiles to planets. It is built upon Newton's laws of motion and the concept of energy.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Kinematics:</strong> The description of motion without considering its causes. Concepts include displacement, velocity, acceleration, and equations of motion for constant acceleration.</li>
        <li><strong>Dynamics:</strong> The study of the causes of motion, primarily forces. Newton's three laws of motion (inertia, F=ma, action-reaction) are central.</li>
        <li><strong>Work, Energy, and Power:</strong> Understanding how energy is transferred and transformed. Concepts include kinetic energy, potential energy (gravitational, elastic), conservation of energy, and power as the rate of doing work.</li>
        <li><strong>Momentum and Collisions:</strong> The conservation of momentum in isolated systems, and its application to various types of collisions (elastic, inelastic).</li>
      </ul>
      <p class="mb-4">Classical mechanics provides the framework for understanding everyday phenomena and is foundational for all other branches of physics.</p>

      <h3 class="text-xl font-semibold mb-3">II. Electromagnetism: Forces of Charge</h3>
      <p class="mb-2">Electromagnetism is the study of the interaction between electric currents and magnetic fields. It unifies electricity and magnetism into a single force.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Electric Charge and Force:</strong> Coulomb's Law describes the force between stationary charged particles. Electric fields are regions where charges experience a force.</li>
        <li><strong>Electric Potential and Circuits:</strong> Concepts of electric potential energy, voltage, current, and resistance. Ohm's Law and basic circuit analysis (series and parallel circuits).</li>
        <li><strong>Magnetic Fields and Forces:</strong> Magnetic fields produced by moving charges and currents. Lorentz force describes the force on a moving charge in a magnetic field.</li>
        <li><strong>Electromagnetic Induction:</strong> Faraday's Law and Lenz's Law describe how changing magnetic fields induce electric currents, forming the basis of generators and transformers.</li>
      </ul>
      <p class="mb-4">Electromagnetism is crucial for understanding technologies like motors, generators, radio, and all forms of electronic devices.</p>

      <h3 class="text-xl font-semibold mb-3">III. Bridging Concepts and Modern Physics</h3>
      <p class="mb-4">The principles of mechanics and electromagnetism are interconnected. For example, the energy concepts from mechanics are applied to understand energy in electric circuits. This course lays the groundwork for more advanced topics such as waves, optics, and an introduction to modern physics concepts like relativity and quantum mechanics.</p>
      <p class="mb-4">Engage with the material, use the AI assistant for quick explanations, and leverage the search functionality to navigate through the theory efficiently. Consistent study will lead to a deeper appreciation of the physical laws that govern our universe.</p>
    `,
  },
  chemistry: {
    title: "Chemistry Basics: Atoms, Bonds & Reactions",
    content: `
      <p class="mb-4">Welcome to the Chemistry Basics theory section. This course provides a foundational understanding of chemical principles, from the structure of atoms to the types of chemical reactions.</p>
      
      <h3 class="text-xl font-semibold mb-3">I. Atomic Structure and the Periodic Table</h3>
      <p class="mb-2">Chemistry begins with the atom, the fundamental building block of matter. Understanding its structure is key to understanding chemical behavior.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Subatomic Particles:</strong> Protons, neutrons, and electrons, their properties, and their arrangement within the atom.</li>
        <li><strong>Atomic Number and Mass Number:</strong> How these define an element and its isotopes.</li>
        <li><strong>Electron Configuration:</strong> The arrangement of electrons in an atom's orbitals, which dictates its chemical reactivity.</li>
        <li><strong>The Periodic Table:</strong> Organization of elements based on atomic number and recurring chemical properties. Understanding groups, periods, and trends (electronegativity, ionization energy, atomic radius).</li>
      </ul>
      <p class="mb-4">The periodic table is the chemist's most important tool, providing a systematic way to predict elemental behavior.</p>

      <h3 class="text-xl font-semibold mb-3">II. Chemical Bonding and Molecular Structure</h3>
      <p class="mb-2">Atoms combine to form molecules through chemical bonds. The type of bond influences the properties of the resulting compound.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Ionic Bonding:</strong> Transfer of electrons between atoms, typically between metals and nonmetals, forming ions held together by electrostatic forces.</li>
        <li><strong>Covalent Bonding:</strong> Sharing of electrons between atoms, typically between nonmetals. Concepts include single, double, and triple bonds, and polarity.</li>
        <li><strong>Metallic Bonding:</strong> A "sea" of delocalized electrons shared among a lattice of metal atoms, explaining properties like conductivity.</li>
        <li><strong>Molecular Geometry:</strong> Shapes of molecules (e.g., linear, trigonal planar, tetrahedral) determined by electron pair repulsion, influencing physical and chemical properties.</li>
      </ul>
      <p class="mb-4">Understanding bonding is crucial for predicting how molecules interact and react with each other.</p>

      <h3 class="text-xl font-semibold mb-3">III. Chemical Reactions and Stoichiometry</h3>
      <p class="mb-2">Chemical reactions involve the rearrangement of atoms and molecules. Stoichiometry is the quantitative relationship between reactants and products.</p>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Types of Reactions:</strong> Synthesis, decomposition, single displacement, double displacement, combustion, and acid-base reactions.</li>
        <li><strong>Balancing Chemical Equations:</strong> Ensuring conservation of mass by having equal numbers of each type of atom on both sides of the equation.</li>
        <li><strong>Mole Concept:</strong> The central unit in chemistry for relating macroscopic quantities to microscopic atoms and molecules.</li>
        <li><strong>Reaction Rates and Equilibrium:</strong> Factors affecting how fast reactions occur and the state where forward and reverse reaction rates are equal.</li>
      </ul>
      <p class="mb-4">This section provides the tools to predict the outcomes of chemical processes and calculate the amounts of substances involved.</p>

      <p class="mb-4">To master these basics, actively engage with the material. Use the AI assistant for quick clarifications on concepts or reactions, and the search bar to find specific terms within the theory. Consistent effort will build a strong foundation in chemistry.</p>
    `,
  },
}

export default function SubjectTheoryPage() {
  const params = useParams()
  const { subjectid } = params

  const theory = mockTheoryContent[subjectid]

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};


  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: data.text }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getSubjectName = (id) => {
    switch (id) {
      case "mathematics":
        return "Advanced Mathematics"
      case "physics":
        return "Physics Fundamentals"
      case "chemistry":
        return "Chemistry Basics"
      default:
        return id.charAt(0).toUpperCase() + id.slice(1)
    }
  }

  const subjectName = getSubjectName(subjectid)

  if (!theory) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Theory Not Found</h2>
        <p className="text-gray-600 mb-6">The theory content for subject "{subjectid}" could not be found.</p>
        <Link href="/Dashboard/StudentDashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/StudentDashboard/Courses/${subjectid}`}
              className="flex items-center space-x-3 text-gray-900 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500">Student Dashboard</p>
              </div>
            </Link>
            <Badge variant="secondary" className="text-sm">
              {subjectName} Theory
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Column: Theory Content */}
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{theory.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: theory.content }} />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Assistant & Search */}
        <div className="w-full lg:w-96 flex-shrink-0 space-y-8">
          {/* Search Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-blue-600" />
                <span>Search Theory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input placeholder="Search within theory..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">(Note: Search functionality is a placeholder for now)</p>
            </CardContent>
          </Card>

                  {/* AI Assistant */}
          <Card className="flex-1 flex flex-col h-[calc(100vh-450px)] lg:h-[calc(100vh-320px)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span>AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-hidden">
              <ScrollArea className="flex-1 pr-4 overflow-x-hidden">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      Ask me anything about {subjectName}!
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg overflow-hidden break-words ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                      {msg.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-900 rounded-bl-none">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
