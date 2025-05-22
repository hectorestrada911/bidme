"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CATEGORY_OPTIONS, CategoryOption } from "@/lib/categories"

interface FormData {
  title: string
  description: string
  quantity: string
  budget: string
  deadline: string
  category: string
}

export default function RequestForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    quantity: "1",
    budget: "",
    deadline: "",
    category: CATEGORY_OPTIONS[0].value
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
        throw new Error("All fields are required")
      }

      const quantity = Number(formData.quantity)
      const budget = Number(formData.budget)

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0")
      }

      if (budget <= 0) {
        throw new Error("Budget must be greater than 0")
      }

      const deadline = new Date(formData.deadline)
      if (deadline <= new Date()) {
        throw new Error("Deadline must be in the future")
      }

      // Check if user is authenticated
      if (!session?.user?.id) {
        throw new Error("Please sign in to create a request")
      }

      // Submit request
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          quantity,
          budget,
          deadline: formData.deadline,
          category: formData.category,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create request")
      }

      toast({
        title: "Success",
        description: "Your request has been created successfully!",
      })

      // Reset form and redirect
      setFormData({
        title: "",
        description: "",
        quantity: "1",
        budget: "",
        deadline: "",
        category: CATEGORY_OPTIONS[0].value
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Sign in to create requests</h2>
          <p className="text-muted-foreground mb-4">Please sign in with your Google account to create requests.</p>
          <Button onClick={() => router.push("/auth/signin")}>
            Sign in with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Request</CardTitle>
        <CardDescription>Post what you want, and let sellers compete to give you the best price.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Web Development Project"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you need..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option: CategoryOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
