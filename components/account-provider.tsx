"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AccountRole = "influencer" | "admin"

type Account = {
  id: string
  name: string
  email: string
  avatar: string
  role: AccountRole
}

type AccountContextType = {
  accounts: Account[]
  currentAccount: Account | null
  switchAccount: (id: string) => void
}

const accounts: Account[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "influencer",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@virionlabs.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "admin",
  },
]

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentAccount, setCurrentAccount] = useState<Account>(accounts[0])

  const switchAccount = (id: string) => {
    const account = accounts.find((acc) => acc.id === id)
    if (account) {
      setCurrentAccount(account)
    }
  }

  return (
    <AccountContext.Provider value={{ accounts, currentAccount, switchAccount }}>{children}</AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}
