import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-[350px] shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            ShadCN + Tailwind Test 🚀
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground">
            If you see this styled card and button, your setup works perfectly!
          </p>
          <Button onClick={() => alert("It works! 🎉")}>
            Click Me
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
