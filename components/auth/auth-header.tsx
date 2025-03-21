// import Link from "next/link"
// import { UserMenu } from "@/components/auth/user-menu"
// import { createClient } from "@/utils/supabase/server"

// export async function AuthHeader() {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
  
//   if (!user) {
//     return null
//   }
  
//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-14 items-center justify-between">
//         <Link href="/dashboard" className="flex items-center gap-2 font-bold">
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
//             DataLinc
//           </span>
//         </Link>
//         <div className="flex items-center gap-4">
//           <UserMenu user={user} />
//         </div>
//       </div>
//     </header>
//   )
// } 