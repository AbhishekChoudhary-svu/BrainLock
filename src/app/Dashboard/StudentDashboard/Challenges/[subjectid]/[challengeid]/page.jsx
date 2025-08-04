"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Brain, CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, AlertCircle } from "lucide-react"

// Mock MCQ data (20 questions for demonstration)
const mockMcqData = {
  "calculus-derivatives": [
    {
      id: 1,
      question: "What is the derivative of f(x) = x^2?",
      options: ["x", "2x", "x^3/3", "2"],
      correctAnswer: "2x",
    },
    {
      id: 2,
      question: "Find the derivative of sin(x).",
      options: ["cos(x)", "-cos(x)", "tan(x)", "sec(x)"],
      correctAnswer: "cos(x)",
    },
    {
      id: 3,
      question: "If f(x) = e^x, what is f'(x)?",
      options: ["e^x", "xe^(x-1)", "ln(x)", "1/e^x"],
      correctAnswer: "e^x",
    },
    {
      id: 4,
      question: "What is the derivative of ln(x)?",
      options: ["x", "1/x", "e^x", "log(x)"],
      correctAnswer: "1/x",
    },
    {
      id: 5,
      question: "Find the derivative of f(x) = 3x^4 - 2x + 5.",
      options: ["12x^3 - 2", "4x^3 - 2", "3x^3 - 2", "12x^3 + 5"],
      correctAnswer: "12x^3 - 2",
    },
    {
      id: 6,
      question: "What is the derivative of cos(x)?",
      options: ["sin(x)", "-sin(x)", "tan(x)", "cot(x)"],
      correctAnswer: "-sin(x)",
    },
    {
      id: 7,
      question: "Apply the product rule to find the derivative of x * e^x.",
      options: ["e^x", "x*e^x", "e^x(x+1)", "x*e^x + 1"],
      correctAnswer: "e^x(x+1)",
    },
    {
      id: 8,
      question: "What is the derivative of a constant, e.g., f(x) = 7?",
      options: ["7", "x", "0", "1"],
      correctAnswer: "0",
    },
    {
      id: 9,
      question: "Find the derivative of tan(x).",
      options: ["sec^2(x)", "cot(x)", "sin(x)", "cos(x)"],
      correctAnswer: "sec^2(x)",
    },
    {
      id: 10,
      question: "Using the chain rule, find the derivative of (2x + 1)^3.",
      options: ["3(2x+1)^2", "6(2x+1)^2", "2(2x+1)^2", "3(2x+1)"],
      correctAnswer: "6(2x+1)^2",
    },
    {
      id: 11,
      question: "What is the derivative of arcsin(x)?",
      options: ["1/sqrt(1-x^2)", "-1/sqrt(1-x^2)", "1/(1+x^2)", "x/sqrt(1-x^2)"],
      correctAnswer: "1/sqrt(1-x^2)",
    },
    {
      id: 12,
      question: "Find the derivative of f(x) = log_a(x).",
      options: ["1/x", "1/(x ln a)", "ln a / x", "a^x"],
      correctAnswer: "1/(x ln a)",
    },
    {
      id: 13,
      question: "What is the derivative of csc(x)?",
      options: ["-csc(x)cot(x)", "csc(x)cot(x)", "sec(x)tan(x)", "-sec(x)tan(x)"],
      correctAnswer: "-csc(x)cot(x)",
    },
    {
      id: 14,
      question: "If y = x^n, what is dy/dx?",
      options: ["n*x^(n-1)", "x^(n-1)", "n*x^n", "n*x^(n+1)"],
      correctAnswer: "n*x^(n-1)",
    },
    {
      id: 15,
      question: "Find the derivative of f(x) = sqrt(x).",
      options: ["1/sqrt(x)", "2/sqrt(x)", "1/(2*sqrt(x))", "sqrt(x)/2"],
      correctAnswer: "1/(2*sqrt(x))",
    },
    {
      id: 16,
      question: "What is the derivative of cot(x)?",
      options: ["sec^2(x)", "-csc^2(x)", "tan(x)", "cot(x)"],
      correctAnswer: "-csc^2(x)",
    },
    {
      id: 17,
      question: "Apply the quotient rule to find the derivative of x / sin(x).",
      options: ["(sin(x) - x*cos(x)) / sin^2(x)", "(x*cos(x) - sin(x)) / sin^2(x)", "cos(x) / sin(x)", "1 / cos(x)"],
      correctAnswer: "(sin(x) - x*cos(x)) / sin^2(x)",
    },
    {
      id: 18,
      question: "What is the second derivative of f(x) = x^3?",
      options: ["3x^2", "6x", "x^2", "6"],
      correctAnswer: "6x",
    },
    {
      id: 19,
      question: "Find the derivative of f(x) = 1/x.",
      options: ["ln(x)", "-1/x^2", "1/x^2", "x"],
      correctAnswer: "-1/x^2",
    },
    {
      id: 20,
      question: "If f(x) = a^x, what is f'(x)?",
      options: ["a^x", "x*a^(x-1)", "a^x * ln(a)", "ln(a)"],
      correctAnswer: "a^x * ln(a)",
    },
  ],
  "newtons-laws-quiz": [
    {
      id: 1,
      question: "Newton's First Law is also known as the Law of...",
      options: ["Motion", "Inertia", "Action-Reaction", "Gravity"],
      correctAnswer: "Inertia",
    },
    {
      id: 2,
      question: "Which of Newton's Laws states that F = ma?",
      options: ["First Law", "Second Law", "Third Law", "Law of Universal Gravitation"],
      correctAnswer: "Second Law",
    },
    {
      id: 3,
      question: "For every action, there is an equal and opposite reaction. This is Newton's...",
      options: ["First Law", "Second Law", "Third Law", "Law of Conservation of Energy"],
      correctAnswer: "Third Law",
    },
    {
      id: 4,
      question: "A force is required to change an object's state of motion. This is a consequence of which law?",
      options: ["First Law", "Second Law", "Third Law", "Law of Conservation of Momentum"],
      correctAnswer: "First Law",
    },
    {
      id: 5,
      question: "If you push a wall, the wall pushes back on you with equal force. This illustrates which law?",
      options: ["First Law", "Second Law", "Third Law", "Law of Inertia"],
      correctAnswer: "Third Law",
    },
    {
      id: 6,
      question: "What is the unit of force in the SI system?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correctAnswer: "Newton",
    },
    {
      id: 7,
      question: "Mass is a measure of an object's...",
      options: ["Weight", "Volume", "Inertia", "Density"],
      correctAnswer: "Inertia",
    },
    {
      id: 8,
      question: "If an object is at rest, it will remain at rest unless acted upon by a(n) ______ force.",
      options: ["Internal", "Balanced", "Unbalanced", "Gravitational"],
      correctAnswer: "Unbalanced",
    },
    {
      id: 9,
      question:
        "Acceleration is directly proportional to the net force and inversely proportional to the mass. This is part of which law?",
      options: ["First Law", "Second Law", "Third Law", "Law of Universal Gravitation"],
      correctAnswer: "Second Law",
    },
    {
      id: 10,
      question:
        "When a rocket takes off, the exhaust gases are pushed downward, and the rocket is pushed upward. This is an example of...",
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Conservation of Energy"],
      correctAnswer: "Newton's Third Law",
    },
    {
      id: 11,
      question: "Which of the following is a scalar quantity?",
      options: ["Velocity", "Force", "Mass", "Acceleration"],
      correctAnswer: "Mass",
    },
    {
      id: 12,
      question: "The tendency of an object to resist changes in its state of motion is called:",
      options: ["Force", "Momentum", "Inertia", "Weight"],
      correctAnswer: "Inertia",
    },
    {
      id: 13,
      question: "If the net force on an object is zero, then the object's acceleration is:",
      options: ["Positive", "Negative", "Zero", "Constant but non-zero"],
      correctAnswer: "Zero",
    },
    {
      id: 14,
      question: "A car suddenly stops. Why do passengers lurch forward?",
      options: ["Newton's Second Law", "Newton's Third Law", "Inertia", "Gravity"],
      correctAnswer: "Inertia",
    },
    {
      id: 15,
      question: "What is the formula for weight?",
      options: ["m/g", "m*g", "F*d", "P/t"],
      correctAnswer: "m*g",
    },
    {
      id: 16,
      question: "Which law explains why a gun recoils when fired?",
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Conservation of Mass"],
      correctAnswer: "Newton's Third Law",
    },
    {
      id: 17,
      question: "If you double the force on an object, what happens to its acceleration (assuming constant mass)?",
      options: ["Halves", "Doubles", "Stays the same", "Quadruples"],
      correctAnswer: "Doubles",
    },
    {
      id: 18,
      question: "What is the relationship between force, mass, and acceleration?",
      options: ["F = m/a", "F = a/m", "F = m*a", "F = m+a"],
      correctAnswer: "F = m*a",
    },
    {
      id: 19,
      question:
        "An object in motion will stay in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This is part of which law?",
      options: ["First Law", "Second Law", "Third Law", "Law of Universal Gravitation"],
      correctAnswer: "First Law",
    },
    {
      id: 20,
      question: "What is the SI unit for mass?",
      options: ["Gram", "Pound", "Kilogram", "Newton"],
      correctAnswer: "Kilogram",
    },
  ],
  "periodic-table-quiz": [
    {
      id: 1,
      question: "Which element has the atomic number 1?",
      options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
      correctAnswer: "Hydrogen",
    },
    {
      id: 2,
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au",
    },
    {
      id: 3,
      question: "Which group contains the noble gases?",
      options: ["Group 1", "Group 17", "Group 18", "Group 2"],
      correctAnswer: "Group 18",
    },
    {
      id: 4,
      question: "What is the most abundant element in the Earth's crust?",
      options: ["Silicon", "Aluminum", "Iron", "Oxygen"],
      correctAnswer: "Oxygen",
    },
    {
      id: 5,
      question: "Elements in the same period have the same number of...",
      options: ["Valence electrons", "Protons", "Electron shells", "Neutrons"],
      correctAnswer: "Electron shells",
    },
    {
      id: 6,
      question: "Which of these is a halogen?",
      options: ["Sodium", "Chlorine", "Neon", "Magnesium"],
      correctAnswer: "Chlorine",
    },
    {
      id: 7,
      question: "What is the atomic number of Carbon?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "6",
    },
    {
      id: 8,
      question: "Which element is a liquid at room temperature?",
      options: ["Iron", "Bromine", "Sulfur", "Carbon"],
      correctAnswer: "Bromine",
    },
    {
      id: 9,
      question: "The alkali metals are found in which group?",
      options: ["Group 1", "Group 2", "Group 13", "Group 14"],
      correctAnswer: "Group 1",
    },
    {
      id: 10,
      question: "What is the chemical symbol for Iron?",
      options: ["Ir", "Fe", "In", "Io"],
      correctAnswer: "Fe",
    },
    {
      id: 11,
      question: "Which element is essential for human respiration?",
      options: ["Nitrogen", "Carbon Dioxide", "Oxygen", "Hydrogen"],
      correctAnswer: "Oxygen",
    },
    {
      id: 12,
      question: "What is the name of the element with the symbol 'Na'?",
      options: ["Nitrogen", "Neon", "Sodium", "Nickel"],
      correctAnswer: "Sodium",
    },
    {
      id: 13,
      question: "Which of these is a metalloid?",
      options: ["Copper", "Silicon", "Fluorine", "Lead"],
      correctAnswer: "Silicon",
    },
    {
      id: 14,
      question: "What is the chemical symbol for Silver?",
      options: ["Si", "Sr", "Ag", "Au"],
      correctAnswer: "Ag",
    },
    {
      id: 15,
      question: "Which element is known as the 'King of Chemicals'?",
      options: ["Sulfur", "Oxygen", "Carbon", "Nitrogen"],
      correctAnswer: "Sulfur",
    },
    {
      id: 16,
      question: "How many periods are there in the modern periodic table?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
    },
    {
      id: 17,
      question: "Which element is used in fluorescent lights?",
      options: ["Argon", "Xenon", "Neon", "Krypton"],
      correctAnswer: "Neon",
    },
    {
      id: 18,
      question: "What is the chemical symbol for Potassium?",
      options: ["P", "Po", "K", "Pt"],
      correctAnswer: "K",
    },
    {
      id: 19,
      question: "Which element is the primary component of diamonds and graphite?",
      options: ["Silicon", "Carbon", "Boron", "Sulfur"],
      correctAnswer: "Carbon",
    },
    {
      id: 20,
      question: "Elements in Group 2 are known as:",
      options: ["Alkali metals", "Alkaline earth metals", "Halogens", "Chalcogens"],
      correctAnswer: "Alkaline earth metals",
    },
  ],
  "linear-equations-challenge": [
    {
      id: 1,
      question: "Solve for x: 2x + 5 = 15",
      options: ["x = 5", "x = 10", "x = 2.5", "x = 7.5"],
      correctAnswer: "x = 5",
    },
    {
      id: 2,
      question: "Solve for y: 3y - 7 = 8",
      options: ["y = 5", "y = 1/3", "y = 15", "y = 3"],
      correctAnswer: "y = 5",
    },
    {
      id: 3,
      question: "If 4x - 2 = 10, what is x?",
      options: ["x = 2", "x = 3", "x = 4", "x = 6"],
      correctAnswer: "x = 3",
    },
    {
      id: 4,
      question: "Solve: x/2 + 3 = 7",
      options: ["x = 4", "x = 8", "x = 10", "x = 2"],
      correctAnswer: "x = 8",
    },
    {
      id: 5,
      question: "What is the value of z in 5z - 1 = 24?",
      options: ["z = 4", "z = 5", "z = 6", "z = 25"],
      correctAnswer: "z = 5",
    },
    {
      id: 6,
      question: "Solve for a: 2(a + 3) = 14",
      options: ["a = 4", "a = 5", "a = 7", "a = 10"],
      correctAnswer: "a = 4",
    },
    {
      id: 7,
      question: "If 7 - x = 12, what is x?",
      options: ["x = 5", "x = -5", "x = 19", "x = -19"],
      correctAnswer: "x = -5",
    },
    {
      id: 8,
      question: "Solve: (x - 4) / 3 = 2",
      options: ["x = 6", "x = 10", "x = 2", "x = 8"],
      correctAnswer: "x = 10",
    },
    {
      id: 9,
      question: "What is the solution to 6x = 3x + 9?",
      options: ["x = 1", "x = 2", "x = 3", "x = 9"],
      correctAnswer: "x = 3",
    },
    {
      id: 10,
      question: "Solve for m: 4m + 8 = 2m + 16",
      options: ["m = 2", "m = 4", "m = 8", "m = 12"],
      correctAnswer: "m = 4",
    },
    {
      id: 11,
      question: "If 5(x - 1) = 20, what is x?",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: "x = 5",
    },
    {
      id: 12,
      question: "Solve: 10 - 2y = 4",
      options: ["y = 3", "y = -3", "y = 7", "y = -7"],
      correctAnswer: "y = 3",
    },
    {
      id: 13,
      question: "What is the value of p in p/4 - 1 = 0?",
      options: ["p = 1", "p = 4", "p = -4", "p = 0"],
      correctAnswer: "p = 4",
    },
    {
      id: 14,
      question: "Solve for k: 3k + 2 = 5k - 6",
      options: ["k = 2", "k = 4", "k = 8", "k = -4"],
      correctAnswer: "k = 4",
    },
    {
      id: 15,
      question: "If (x + 5) / 2 = 6, what is x?",
      options: ["x = 1", "x = 7", "x = 12", "x = 17"],
      correctAnswer: "x = 7",
    },
    {
      id: 16,
      question: "Solve: 9 - 3x = 3",
      options: ["x = 2", "x = -2", "x = 4", "x = -4"],
      correctAnswer: "x = 2",
    },
    {
      id: 17,
      question: "What is the solution to 7x - 10 = 4x + 5?",
      options: ["x = 3", "x = 5", "x = 15", "x = -5"],
      correctAnswer: "x = 5",
    },
    {
      id: 18,
      question: "Solve for n: 2(n - 4) = 10",
      options: ["n = 5", "n = 7", "n = 9", "n = 14"],
      correctAnswer: "n = 9",
    },
    {
      id: 19,
      question: "If 1/2 x + 1 = 3, what is x?",
      options: ["x = 2", "x = 4", "x = 6", "x = 8"],
      correctAnswer: "x = 4",
    },
    {
      id: 20,
      question: "What is the value of q in 12 - q = 3q?",
      options: ["q = 2", "q = 3", "q = 4", "q = 6"],
      correctAnswer: "q = 3",
    },
  ],
  "thermodynamics-principles": [
    {
      id: 1,
      question: "The First Law of Thermodynamics is a statement of the conservation of...",
      options: ["Mass", "Momentum", "Energy", "Entropy"],
      correctAnswer: "Energy",
    },
    {
      id: 2,
      question: "Which of the following processes is adiabatic?",
      options: [
        "Heat exchange with surroundings",
        "No heat exchange with surroundings",
        "Constant temperature",
        "Constant pressure",
      ],
      correctAnswer: "No heat exchange with surroundings",
    },
    {
      id: 3,
      question: "What does entropy measure?",
      options: ["Temperature", "Pressure", "Disorder or randomness", "Energy"],
      correctAnswer: "Disorder or randomness",
    },
    {
      id: 4,
      question: "The Second Law of Thermodynamics states that the total entropy of an isolated system can only...",
      options: ["Decrease", "Increase", "Remain constant", "Fluctuate randomly"],
      correctAnswer: "Increase",
    },
    {
      id: 5,
      question: "A process that occurs at constant temperature is called...",
      options: ["Isobaric", "Isochoric", "Isothermal", "Adiabatic"],
      correctAnswer: "Isothermal",
    },
    {
      id: 6,
      question: "What is the SI unit of heat?",
      options: ["Celsius", "Fahrenheit", "Joule", "Watt"],
      correctAnswer: "Joule",
    },
    {
      id: 7,
      question:
        "The Third Law of Thermodynamics states that the entropy of a perfect crystal at absolute zero (0 Kelvin) is...",
      options: ["Maximum", "Infinite", "Zero", "Undefined"],
      correctAnswer: "Zero",
    },
    {
      id: 8,
      question: "Which of these is an extensive property?",
      options: ["Temperature", "Density", "Volume", "Pressure"],
      correctAnswer: "Volume",
    },
    {
      id: 9,
      question: "A heat engine converts heat energy into...",
      options: ["Chemical energy", "Electrical energy", "Mechanical work", "Light energy"],
      correctAnswer: "Mechanical work",
    },
    {
      id: 10,
      question: "The efficiency of a Carnot engine depends on...",
      options: [
        "The type of working substance",
        "The size of the engine",
        "The temperatures of the hot and cold reservoirs",
        "The speed of the engine",
      ],
      correctAnswer: "The temperatures of the hot and cold reservoirs",
    },
    {
      id: 11,
      question: "What is the internal energy of a system?",
      options: [
        "The sum of kinetic and potential energies of its particles",
        "The heat absorbed by the system",
        "The work done by the system",
        "The pressure and volume of the system",
      ],
      correctAnswer: "The sum of kinetic and potential energies of its particles",
    },
    {
      id: 12,
      question: "A process where the volume remains constant is called...",
      options: ["Isobaric", "Isochoric", "Isothermal", "Adiabatic"],
      correctAnswer: "Isochoric",
    },
    {
      id: 13,
      question: "Which law states that heat flows spontaneously from a hotter body to a colder body?",
      options: ["First Law", "Second Law", "Third Law", "Zeroth Law"],
      correctAnswer: "Second Law",
    },
    {
      id: 14,
      question: "What is the SI unit of temperature?",
      options: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"],
      correctAnswer: "Kelvin",
    },
    {
      id: 15,
      question: "The change in enthalpy (ΔH) for a reaction is equal to the heat exchanged at constant...",
      options: ["Volume", "Temperature", "Pressure", "Entropy"],
      correctAnswer: "Pressure",
    },
    {
      id: 16,
      question: "Which of these is an intensive property?",
      options: ["Mass", "Energy", "Temperature", "Number of moles"],
      correctAnswer: "Temperature",
    },
    {
      id: 17,
      question: "A refrigerator works on the principle of...",
      options: [
        "Converting heat to work",
        "Transferring heat from cold to hot",
        "Increasing entropy of the cold reservoir",
        "Decreasing entropy of the universe",
      ],
      correctAnswer: "Transferring heat from cold to hot",
    },
    {
      id: 18,
      question: "What is the definition of a closed system in thermodynamics?",
      options: [
        "Exchanges neither matter nor energy with surroundings",
        "Exchanges energy but not matter with surroundings",
        "Exchanges matter but not energy with surroundings",
        "Exchanges both matter and energy with surroundings",
      ],
      correctAnswer: "Exchanges energy but not matter with surroundings",
    },
    {
      id: 19,
      question: "The work done by a gas expanding against a constant external pressure is given by:",
      options: ["PΔV", "-PΔV", "ΔU + Q", "Q - ΔU"],
      correctAnswer: "-PΔV",
    },
    {
      id: 20,
      question: "What is the primary purpose of a heat pump?",
      options: [
        "To generate electricity",
        "To cool a space by moving heat out",
        "To heat a space by moving heat into it",
        "To convert chemical energy to heat",
      ],
      correctAnswer: "To heat a space by moving heat into it",
    },
  ],
  "organic-chemistry-basics": [
    {
      id: 1,
      question: "Organic chemistry is primarily the study of compounds containing which element?",
      options: ["Oxygen", "Nitrogen", "Carbon", "Hydrogen"],
      correctAnswer: "Carbon",
    },
    {
      id: 2,
      question: "What type of bond is most common in organic compounds?",
      options: ["Ionic", "Metallic", "Covalent", "Hydrogen"],
      correctAnswer: "Covalent",
    },
    {
      id: 3,
      question: "Which of the following is an alkane?",
      options: ["C2H4", "C3H6", "CH4", "C6H6"],
      correctAnswer: "CH4",
    },
    {
      id: 4,
      question: "What is the general formula for an alkene?",
      options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"],
      correctAnswer: "CnH2n",
    },
    {
      id: 5,
      question: "Which functional group characterizes alcohols?",
      options: ["-COOH", "-CHO", "-OH", "-NH2"],
      correctAnswer: "-OH",
    },
    {
      id: 6,
      question: "What is the name of the simplest aromatic hydrocarbon?",
      options: ["Methane", "Ethane", "Benzene", "Toluene"],
      correctAnswer: "Benzene",
    },
    {
      id: 7,
      question: "Which of these is a ketone?",
      options: ["CH3CHO", "CH3COCH3", "CH3COOH", "CH3CH2OH"],
      correctAnswer: "CH3COCH3",
    },
    {
      id: 8,
      question: "What is the process of breaking down large hydrocarbons into smaller ones called?",
      options: ["Polymerization", "Cracking", "Hydrogenation", "Oxidation"],
      correctAnswer: "Cracking",
    },
    {
      id: 9,
      question: "Which functional group contains a carbonyl group bonded to a hydrogen atom and an alkyl group?",
      options: ["Ketone", "Carboxylic acid", "Aldehyde", "Ester"],
      correctAnswer: "Aldehyde",
    },
    {
      id: 10,
      question: "What is the hybridization of carbon in an alkane?",
      options: ["sp", "sp2", "sp3", "dsp2"],
      correctAnswer: "sp3",
    },
    {
      id: 11,
      question: "Which of the following is an isomer of butane?",
      options: ["Propane", "Pentane", "Isobutane", "Butene"],
      correctAnswer: "Isobutane",
    },
    {
      id: 12,
      question: "What is the name of the functional group -COOH?",
      options: ["Aldehyde", "Ketone", "Carboxylic acid", "Ether"],
      correctAnswer: "Carboxylic acid",
    },
    {
      id: 13,
      question: "Which type of reaction involves the addition of hydrogen to an unsaturated hydrocarbon?",
      options: ["Substitution", "Elimination", "Hydrogenation", "Dehydration"],
      correctAnswer: "Hydrogenation",
    },
    {
      id: 14,
      question: "What is the simplest alkene?",
      options: ["Methane", "Ethane", "Ethene", "Propene"],
      correctAnswer: "Ethene",
    },
    {
      id: 15,
      question: "Which of these is a primary amine?",
      options: ["(CH3)3N", "CH3NH2", "(CH3)2NH", "CH3CH2OCH3"],
      correctAnswer: "CH3NH2",
    },
    {
      id: 16,
      question: "What is the general formula for an alkyne?",
      options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"],
      correctAnswer: "CnH2n-2",
    },
    {
      id: 17,
      question: "Which functional group is characterized by an oxygen atom bonded to two alkyl or aryl groups?",
      options: ["Alcohol", "Ether", "Ester", "Aldehyde"],
      correctAnswer: "Ether",
    },
    {
      id: 18,
      question: "What is the name of the process where monomers combine to form a polymer?",
      options: ["Cracking", "Distillation", "Polymerization", "Fermentation"],
      correctAnswer: "Polymerization",
    },
    {
      id: 19,
      question: "Which of the following is a saturated hydrocarbon?",
      options: ["Ethene", "Ethyne", "Benzene", "Ethane"],
      correctAnswer: "Ethane",
    },
    {
      id: 20,
      question: "What is the common name for methanal?",
      options: ["Acetone", "Formaldehyde", "Acetic acid", "Ethanol"],
      correctAnswer: "Formaldehyde",
    },
  ],
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const { subjectid, challengeid } = params

  const questions = mockMcqData[challengeid] // Use challengeId to get specific questions

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { questionId: selectedOption }
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)

  useEffect(() => {
    // Reset state when challengeId changes
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
    setCorrectCount(0)
    setIncorrectCount(0)
  }, [challengeid])

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge Not Found</h2>
        <p className="text-gray-600 mb-6">
          The challenge "{challengeid}" for subject "{subjectid}" could not be found or has no questions.
        </p>
        <Link href={`/Dashboard/StudentDashboard/Challenges/${subjectid}`}>
          <Button>Back to Challenges</Button>
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const handleOptionSelect = (value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    let newScore = 0
    let newCorrectCount = 0
    let newIncorrectCount = 0

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        newScore += 1
        newCorrectCount += 1
      } else {
        newIncorrectCount += 1
      }
    })

    setScore(newScore)
    setCorrectCount(newCorrectCount)
    setIncorrectCount(newIncorrectCount)
    setShowResults(true)
  }

  const getSubjectName = (id) => {
    switch (id) {
      case "mathematics":
        return "Mathematics"
      case "physics":
        return "Physics"
      case "chemistry":
        return "Chemistry"
      default:
        return id.charAt(0).toUpperCase() + id.slice(1)
    }
  }

  const getChallengeTitle = (id) => {
    switch (id) {
      case "calculus-derivatives":
        return "Calculus Derivatives"
      case "newtons-laws-quiz":
        return "Newton's Laws Quiz"
      case "periodic-table-quiz":
        return "Periodic Table Quiz"
      case "linear-equations-challenge":
        return "Linear Equations Challenge"
      case "thermodynamics-principles":
        return "Thermodynamics Principles"
      case "organic-chemistry-basics":
        return "Organic Chemistry Basics"
      default:
        return id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
    }
  }

  const subjectName = getSubjectName(subjectid)
  const challengeTitle = getChallengeTitle(challengeid)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/StudentDashboard/Challenges/${subjectid}`}
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
              {challengeTitle}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">{challengeTitle}</CardTitle>
            <CardDescription className="text-gray-600">Subject: {subjectName}</CardDescription>
            {!showResults && (
              <div className="mt-4">
                <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {showResults ? (
              <div className="text-center space-y-6 py-8">
                <Award className="h-20 w-20 text-yellow-500 mx-auto" />
                <h3 className="text-3xl font-bold text-gray-900">Challenge Completed!</h3>
                <p className="text-xl text-gray-700">
                  You scored {score} out of {totalQuestions}!
                </p>
                <div className="flex justify-center gap-8 text-lg font-semibold">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-6 w-6" /> {correctCount} Correct
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-6 w-6" /> {incorrectCount} Incorrect
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link href={`/Dashboard/StudentDashboard/Challenges/${subjectid}`}>
                    <Button size="lg">Back to Challenges</Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestionIndex(0)
                      setSelectedAnswers({})
                      setShowResults(false)
                      setScore(0)
                      setCorrectCount(0)
                      setIncorrectCount(0)
                    }}
                  >
                    Retake Challenge
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-lg font-semibold text-gray-800">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </div>
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ""}
                  onValueChange={handleOptionSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex justify-between mt-6">
                  <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button onClick={handleSubmitQuiz} disabled={!selectedAnswers[currentQuestion.id]}>
                      Submit Challenge <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion.id]}>
                      Next Question <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
