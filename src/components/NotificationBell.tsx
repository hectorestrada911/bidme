'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  content: string
  link?: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/notifications`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setNotifications(data))
  }, [session?.user?.id, open])

  const unreadCount = notifications.filter(n => !n.read).length

  async function markAllAsRead() {
    await fetch('/api/notifications/mark-read', { method: 'POST' })
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu open={open} onOpenChange={(v) => {
      setOpen(v)
      if (v) markAllAsRead()
    }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6 text-blue-400" />
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0d12]" />
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {unreadCount}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto bg-[#0a0d12] border-blue-900/50">
        <div className="p-2 text-blue-300 font-semibold border-b border-blue-900/30">Notifications</div>
        {notifications.length === 0 ? (
          <div className="p-4 text-blue-400 text-center">No notifications</div>
        ) : (
          notifications.map(n => (
            <DropdownMenuItem key={n.id} className={`flex flex-col items-start gap-1 ${!n.read ? 'bg-blue-950/30' : ''}`}>
              {n.link ? (
                <Link href={n.link} className="text-blue-200 hover:underline w-full">{n.content}</Link>
              ) : (
                <span className="text-blue-200">{n.content}</span>
              )}
              <span className="text-xs text-blue-400">{new Date(n.createdAt).toLocaleString()}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 