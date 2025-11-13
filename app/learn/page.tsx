import { EducationSection } from "@/components/education-section"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LearnPage() {
  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Learning Resources</h1>

          <p className="sm:text-lg text-muted-foreground">
            Learn how to interpret protein classifications and understand functional annotations
          </p>
        </div>

        {/* Main Content */}
        <EducationSection />
      </div>
    </div>
  )
}
