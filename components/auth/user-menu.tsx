// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { toast } from "sonner"
// import { 
//   LogOut, 
//   User, 
//   Settings,
//   CreditCard
// } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// interface UserMenuProps {
//   user: {
//     id: string
//     email?: string
//     user_metadata?: {
//       full_name?: string
//       name?: string
//     }
//   }
// }

// export function UserMenu({ user }: UserMenuProps) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
  
//   // Get display name from metadata or email
//   const displayName = 
//     user?.user_metadata?.full_name || 
//     user?.user_metadata?.name || 
//     user?.email?.split("@")[0] || 
//     "User"
  
//   // Get initials for avatar
//   const initials = displayName
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .substring(0, 2)
  
//   async function handleSignOut() {
//     setIsLoading(true)
    
//     try {
//       const response = await fetch("/api/auth/signout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
      
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to sign out")
//       }
      
//       toast.success("Signed out successfully")
//       router.push("/login")
//       router.refresh()
//     } catch (error: any) {
//       toast.error(error.message || "An error occurred during sign out")
//       console.error(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="" alt={displayName} />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">{displayName}</p>
//             <p className="text-xs leading-none text-muted-foreground">
//               {user.email}
//             </p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem asChild>
//             <Link href="/dashboard/profile">
//               <User className="mr-2 h-4 w-4" />
//               <span>Profile</span>
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link href="/dashboard/billing">
//               <CreditCard className="mr-2 h-4 w-4" />
//               <span>Billing</span>
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link href="/dashboard/settings">
//               <Settings className="mr-2 h-4 w-4" />
//               <span>Settings</span>
//             </Link>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem 
//           disabled={isLoading}
//           onClick={handleSignOut}
//           className="text-red-500 focus:text-red-500"
//         >
//           <LogOut className="mr-2 h-4 w-4" />
//           <span>{isLoading ? "Signing out..." : "Sign out"}</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// } 