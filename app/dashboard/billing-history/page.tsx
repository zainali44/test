"use client"

import { useState, useEffect } from "react"
import {
  Receipt,
  Clock,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  FileDown,
  Filter,
  CreditCard,
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/app/contexts/auth-context"
import Link from "next/link"

// Define types for the transaction data
interface PaymentMethod {
  payment_method_id: number
  type: string
  details: string
}

interface BankDetail {
  id: number
  transaction_id: number
  merchant_amount: number | null
  order_date: string
  bill_number: string
  payment_reference: string
  customer_id: string
  email_address: string
  mobile_no: string
  additional_info: {
    PaymentName: string
    PaymentType: string | number
    issuer_name: string
  }
  createdAt: string
  updatedAt: string
}

interface Transaction {
  transaction_id: number
  status: string
  processed_at: string
  currency: string
  payment_method: PaymentMethod
  amount: string | number
  bank_detail: BankDetail
}

interface TransactionsResponse {
  user_id: number
  count: number
  transactions: Transaction[]
}

export default function BillingHistoryPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [exportLoading, setExportLoading] = useState(false)

  // Fetch transaction data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get user ID from auth context, fallback to 1 if not available
        const userId = user?.id || '1'
        
        // Use our Next.js API route which proxies to the external API
        const apiUrl = `/api/transactions/${userId}`
        
        console.log(`Fetching transactions from: ${apiUrl}`)
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`)
          
          // Try to get more details about the error
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || `Failed to fetch transaction data: ${response.status}`
          
          throw new Error(errorMessage)
        }
        
        // Parse the response
        const data = await response.json()
        
        if (data && Array.isArray(data.transactions)) {
          console.log(`Successfully loaded ${data.transactions.length} transactions`)
          setTransactions(data.transactions)
        } else {
          console.error("Unexpected API response format:", data)
          throw new Error("The API returned an unexpected data format. Expected an object with a 'transactions' array.")
        }
      } catch (err: any) {
        console.error("Error fetching transactions:", err)
        
        let errorMessage = "Failed to load transaction history"
        if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchTransactions()
  }, [user])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Format amount with currency
  const formatAmount = (amount: string | number, currency: string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return `${currency} ${numAmount.toFixed(0)}`
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-0 py-0.5 h-5 text-[10px]">
            <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
            Completed
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-0 py-0.5 h-5 text-[10px]">
            <Clock className="w-2.5 h-2.5 mr-0.5" />
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 border-0 py-0.5 h-5 text-[10px]">
            <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-0 py-0.5 h-5 text-[10px]">
            {status}
          </Badge>
        )
    }
  }

  // Get payment method icon
  const getPaymentIcon = (type: string, details: string) => {
    if (type.toLowerCase() === 'wallet') {
      return <Wallet className="w-3.5 h-3.5 text-purple-600" />
    } else if (type.toLowerCase() === 'card') {
      return <CreditCard className="w-3.5 h-3.5 text-blue-600" />
    } else {
      return <CreditCard className="w-3.5 h-3.5 text-gray-600" />
    }
  }

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    
    return (
      transaction.payment_method.details.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower) ||
      transaction.bank_detail.payment_reference.toLowerCase().includes(searchLower) ||
      transaction.bank_detail.email_address.toLowerCase().includes(searchLower) ||
      formatDate(transaction.processed_at).toLowerCase().includes(searchLower)
    )
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.processed_at).getTime()
      const dateB = new Date(b.processed_at).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    } else if (sortBy === "amount") {
      const amountA = typeof a.amount === 'string' ? parseFloat(a.amount) : a.amount
      const amountB = typeof b.amount === 'string' ? parseFloat(b.amount) : b.amount
      return sortOrder === "asc" ? amountA - amountB : amountB - amountA
    } else if (sortBy === "status") {
      return sortOrder === "asc" 
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    }
    return 0
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)

  // Handle sort toggles
  const handleSort = (column: "date" | "amount" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc") // Default to desc when changing columns
    }
  }

  // Function to handle CSV export
  const handleExport = async () => {
    try {
      setExportLoading(true)
      
      // Create CSV content
      let csvContent = "Date,Transaction ID,Payment Method,Reference,Amount,Status\n"
      
      // Add transaction data rows
      filteredTransactions.forEach(transaction => {
        const date = formatDate(transaction.processed_at)
        const id = transaction.transaction_id
        const paymentMethod = transaction.payment_method.details
        const reference = transaction.bank_detail.payment_reference.replace(/,/g, ' ')
        const amount = formatAmount(transaction.amount, transaction.currency)
        const status = transaction.status
        
        csvContent += `${date},${id},${paymentMethod},${reference},${amount},${status}\n`
      })
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `billing_history_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Error exporting transactions:', error)
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-3 py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mr-1 h-7 px-2">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-xs">Back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-medium text-gray-900">Billing History</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={handleExport}
            disabled={exportLoading || loading || transactions.length === 0}
          >
            {exportLoading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <FileDown className="h-3 w-3 mr-1" />
            )}
            Export
          </Button>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">Review your past transactions and payment history</p>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
        <div className="w-full sm:max-w-xs">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search transactions..."
              className="pl-8 h-8 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-1 self-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs px-2 h-7 ${sortBy === "date" ? "bg-gray-100" : ""}`}
            onClick={() => handleSort("date")}
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs px-2 h-7 ${sortBy === "amount" ? "bg-gray-100" : ""}`}
            onClick={() => handleSort("amount")}
          >
            Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs px-2 h-7 ${sortBy === "status" ? "bg-gray-100" : ""}`}
            onClick={() => handleSort("status")}
          >
            Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {/* Transactions list */}
      <Card className="mb-4 border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Loading transaction history...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-10">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
            <p className="text-gray-700 text-sm mb-1">Unable to load your transaction history</p>
            <p className="text-gray-500 text-xs max-w-md text-center mb-3">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => {
                setLoading(true)
                setError(null)
                window.location.reload()
              }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-10">
            <Receipt className="h-8 w-8 text-gray-400 mb-3" />
            <p className="text-gray-700 text-sm mb-1">No transactions found</p>
            <p className="text-gray-500 text-xs">
              {searchTerm ? "Try a different search term" : "Your billing history will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1.5 px-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-1.5 px-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="text-left py-1.5 px-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="text-left py-1.5 px-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right py-1.5 px-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((transaction) => (
                  <tr 
                    key={transaction.transaction_id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-xs text-gray-900">
                        {formatDate(transaction.processed_at)}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        ID: {transaction.transaction_id}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center">
                        {getPaymentIcon(
                          transaction.payment_method.type, 
                          transaction.payment_method.details
                        )}
                        <span className="ml-1.5 text-xs text-gray-900">
                          {transaction.payment_method.details}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 ml-5">
                        {transaction.bank_detail.mobile_no}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-[10px] text-gray-500 max-w-[140px] truncate" title={transaction.bank_detail.payment_reference}>
                        {transaction.bank_detail.payment_reference}
                      </div>
                      <div className="text-[10px] text-gray-500 max-w-[140px] truncate">
                        {transaction.bank_detail.email_address}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-xs text-gray-900">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {getStatusBadge(transaction.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
                <div className="text-[10px] text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedTransactions.length)} of {sortedTransactions.length} transactions
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 rounded-sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show at most 5 page buttons, centered around current page
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        className={`h-5 w-5 p-0 text-[10px] rounded-sm ${currentPage === pageNum ? "bg-emerald-600" : ""}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 rounded-sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Additional details */}
      <div className="text-[10px] text-gray-500 mt-3">
        <p>Note: All transactions are processed securely through our payment gateway.</p>
        <p>If you have any questions about your billing history, please contact customer support.</p>
      </div>
    </div>
  )
} 