import { EducationSection } from "@/components/education-section"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Learning Resources</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to interpret protein classifications and understand functional annotations
          </p>
        </div>

        {/* Main Content */}
        <EducationSection />
      </div>
    </div>
  )
}
