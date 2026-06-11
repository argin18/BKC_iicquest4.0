import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CalculatorWidget() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  const handleNumber = (num: string) => {
    setDisplay(display === "0" ? num : display + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const calculate = () => {
    try {
      // Evaluate equation strictly.
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation("");
    } catch (e) {
      setDisplay("Error");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
  };

  return (
    <div className="w-56 p-2 bg-card rounded-lg shadow-xl border border-border">
      <div className="bg-muted p-2 rounded text-right mb-2 min-h-12 flex flex-col justify-end overflow-hidden">
        <div className="text-[10px] text-muted-foreground h-4">{equation}</div>
        <div className="text-xl font-mono tracking-tight">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <Button variant="outline" className="col-span-2 h-8" onClick={clear}>C</Button>
        <Button variant="outline" className="h-8" onClick={() => handleOperator("/")}>/</Button>
        <Button variant="outline" className="h-8" onClick={() => handleOperator("*")}>x</Button>
        
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("7")}>7</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("8")}>8</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("9")}>9</Button>
        <Button variant="outline" className="h-8" onClick={() => handleOperator("-")}>-</Button>
        
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("4")}>4</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("5")}>5</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("6")}>6</Button>
        <Button variant="outline" className="h-8" onClick={() => handleOperator("+")}>+</Button>
        
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("1")}>1</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("2")}>2</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber("3")}>3</Button>
        <Button variant="default" className="h-[40px] row-span-2" onClick={calculate}>=</Button>
        
        <Button variant="secondary" className="col-span-2 h-8" onClick={() => handleNumber("0")}>0</Button>
        <Button variant="secondary" className="h-8" onClick={() => handleNumber(".")}>.</Button>
      </div>
    </div>
  );
}
