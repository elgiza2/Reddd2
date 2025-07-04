import { Home, Search, Library } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function BottomNavigation() {
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-secondary/80 backdrop-blur md:hidden">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        <Button variant="ghost" className="w-full rounded-none" asChild>
          <Link to="/" className="flex flex-col items-center justify-center w-full">
            <Home className={`h-6 w-6 ${location.pathname === "/" ? "text-primary" : ""}`} />
            <span className="text-xs">Home</span>
          </Link>
        </Button>
        <Button variant="ghost" className="w-full rounded-none" asChild>
          <Link to="/search" className="flex flex-col items-center justify-center w-full">
            <Search className={`h-6 w-6 ${location.pathname === "/search" ? "text-primary" : ""}`} />
            <span className="text-xs">Search</span>
          </Link>
        </Button>
        <Button variant="ghost" className="w-full rounded-none" asChild>
          <Link to="/library" className="flex flex-col items-center justify-center w-full">
            <Library className={`h-6 w-6 ${location.pathname === "/library" ? "text-primary" : ""}`} />
            <span className="text-xs">Library</span>
          </Link>
        </Button>
      </div>
    </nav>
  )
}
