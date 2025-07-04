"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckCheck, Copy, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface Case {
  id: string
  title: string
  description: string
  prompt: string
  solution: string
  createdAt: Date
  updatedAt: Date
}

const CasePage = () => {
  const params = useParams()
  const router = useRouter()
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedSolution, setCopiedSolution] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/case/${params.id}`)
        if (!response.ok) {
          router.push("/cases")
          return
        }
        const data = await response.json()
        setCaseData(data)
      } catch (error) {
        console.error("Failed to fetch case:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCase()
    }
  }, [params.id, router])

  const handleCopyPrompt = () => {
    if (caseData) {
      navigator.clipboard.writeText(caseData.prompt)
      setCopiedPrompt(true)
      toast({
        title: "Prompt copied!",
        description: "The prompt has been copied to your clipboard.",
      })
      setTimeout(() => setCopiedPrompt(false), 2000)
    }
  }

  const handleCopySolution = () => {
    if (caseData) {
      navigator.clipboard.writeText(caseData.solution)
      setCopiedSolution(true)
      toast({
        title: "Solution copied!",
        description: "The solution has been copied to your clipboard.",
      })
      setTimeout(() => setCopiedSolution(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-60 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-60 w-full mb-4" />
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <p className="text-sm text-muted-foreground">Case not found. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <p className="text-muted-foreground">{new Date(caseData.createdAt).toLocaleDateString()}</p>
        </div>
        <Link href={`/case/${caseData.id}/edit`}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <Badge className="mb-2">Case</Badge>
      <p className="mb-4">{caseData.description}</p>

      <Separator className="mb-4" />

      <h2 className="text-xl font-semibold mb-2">Prompt</h2>
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleCopyPrompt}
          disabled={copiedPrompt}
        >
          {copiedPrompt ? (
            <>
              <CheckCheck className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        <div className="rounded-md border p-4 font-mono whitespace-pre-wrap break-words">{caseData.prompt}</div>
      </div>

      <Separator className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Solution</h2>
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleCopySolution}
          disabled={copiedSolution}
        >
          {copiedSolution ? (
            <>
              <CheckCheck className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        <div className="rounded-md border p-4 font-mono whitespace-pre-wrap break-words">{caseData.solution}</div>
      </div>
    </div>
  )
}

export default CasePage
