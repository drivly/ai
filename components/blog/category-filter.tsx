"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
  selectedCategories: string[]
  onSelectCategories: (categories: string[]) => void
}

export function CategoryFilter({ categories, selectedCategories, onSelectCategories }: CategoryFilterProps) {
  // Function to toggle a category selection
  const toggleCategory = (category: string | null) => {
    if (category === null) {
      // If "All" is clicked, clear all selections
      onSelectCategories([])
    } else {
      // If the category is already selected, remove it, otherwise add it
      if (selectedCategories.includes(category)) {
        onSelectCategories(selectedCategories.filter((c) => c !== category))
      } else {
        onSelectCategories([...selectedCategories, category])
      }
    }
  }

  // Add three more categories if they don't exist in the provided categories
  const additionalCategories = ["Machine Learning", "Developer Tools", "Case Studies"].filter(
    (cat) => !categories.includes(cat),
  )

  const allCategories = [...categories, ...additionalCategories]

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-2">
      <Badge
        variant={selectedCategories.length === 0 ? "solid" : "default"}
        className={cn(
          "cursor-pointer text-sm sm:text-xs py-1.5 px-3 sm:px-2.5 sm:py-1",
          selectedCategories.length === 0
            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800/50",
        )}
        onClick={() => toggleCategory(null)}
      >
        All
      </Badge>
      {allCategories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategories.includes(category) ? "solid" : "default"}
          className={cn(
            "cursor-pointer text-sm sm:text-xs py-1.5 px-3 sm:px-2.5 sm:py-1",
            selectedCategories.includes(category)
              ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800/50",
          )}
          onClick={() => toggleCategory(category)}
        >
          {category}
        </Badge>
      ))}

      {selectedCategories.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectCategories([])}
          className="h-8 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs text-muted-foreground hover:text-primary transition-colors rounded-full"
        >
          <XIcon className="h-3 w-3 mr-1" />
          Clear ({selectedCategories.length})
        </Button>
      )}
    </div>
  )
}

