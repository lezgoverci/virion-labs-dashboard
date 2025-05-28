"use client"

import type React from "react"

import { useState } from "react"
import { Copy, ExternalLink, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LinkGenerationForm({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState<"form" | "result">("form")
  const [generatedLink, setGeneratedLink] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to generate the link
    setGeneratedLink("https://ref.virionlabs.com/" + Math.random().toString(36).substring(2, 8))
    setStep("result")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink)
  }

  const handleReset = () => {
    setStep("form")
    setGeneratedLink("")
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <div className="space-y-4">
      {step === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content-url">Content URL</Label>
            <Input id="content-url" placeholder="Paste your content/video URL" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign (Optional)</Label>
              <Input id="campaign" placeholder="e.g., Summer Sale" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" placeholder="Add a description for this link" />
          </div>
          <Button type="submit" className="w-full">
            Generate Link
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your referral link</Label>
            <div className="flex items-center gap-2">
              <Input value={generatedLink} readOnly />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
          <Button onClick={handleReset} className="w-full">
            Create Another Link
          </Button>
        </div>
      )}
    </div>
  )
}
