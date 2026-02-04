'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, User, MessageSquare, Search, Trash2, CheckCircle, Clock, Loader2, X, ArrowRight, Send } from 'lucide-react'

export default function ContactsManagement() {
    const [contacts, setContacts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMessage, setSelectedMessage] = useState<any>(null)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/contacts')
            const result = await response.json()
            if (result.success) {
                setContacts(result.data)
            }
        } catch (error) {
            console.error('Failed to fetch contacts', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/contacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            const result = await response.json()
            if (result.success) {
                setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c))
                if (selectedMessage?.id === id) {
                    setSelectedMessage({ ...selectedMessage, status: newStatus })
                }
            }
        } catch (error) {
            console.error('Failed to update status', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return
        try {
            const response = await fetch(`/api/admin/contacts/${id}`, {
                method: 'DELETE'
            })
            const result = await response.json()
            if (result.success) {
                setContacts(contacts.filter(c => c.id !== id))
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null)
                }
            }
        } catch (error) {
            console.error('Failed to delete contact', error)
            alert('Lỗi khi xóa tin nhắn')
        }
    }

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.product_category || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="text-primary" /> Quản lý liên hệ
                    </h1>
                    <p className="text-slate-500">Xem và quản lý phản hồi từ khách hàng qua form liên hệ.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc tiêu đề..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-1 space-y-4">
                    {isLoading ? (
                        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                            <p className="text-slate-500 text-sm">Đang tải...</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-50">
                                {filteredContacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => {
                                            setSelectedMessage(contact)
                                            if (contact.status === 'unread' || contact.status === 'new') {
                                                handleStatusUpdate(contact.id, 'read')
                                            }
                                        }}
                                        className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${selectedMessage?.id === contact.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-900 truncate pr-2">{contact.name}</span>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                {new Date(contact.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">{contact.product_category || '(Không tiêu đề)'}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${contact.status === 'unread' || contact.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {contact.status === 'unread' || contact.status === 'new' ? 'Chưa đọc' : 'Đã xem'}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                                {filteredContacts.length === 0 && (
                                    <div className="p-12 text-center text-slate-400">Không có dữ liệu.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">{selectedMessage.product_category || 'Liên hệ từ website'}</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100"><User size={14} className="text-primary" /></div>
                                        <div className="truncate">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Người gửi</div>
                                            {selectedMessage.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100"><Mail size={14} className="text-blue-500" /></div>
                                        <div className="truncate">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Email</div>
                                            {selectedMessage.email}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100"><Phone size={14} className="text-emerald-500" /></div>
                                        <div className="truncate">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Số điện thoại</div>
                                            {selectedMessage.phone || 'N/A'}
                                        </div>
                                    </div>
                                    {selectedMessage.company && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="p-2 bg-white rounded-lg border border-slate-100"><MessageSquare size={14} className="text-amber-500" /></div>
                                            <div className="truncate">
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Công ty</div>
                                                {selectedMessage.company}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {(selectedMessage.quantity || selectedMessage.budget || selectedMessage.timeline) && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                                        {selectedMessage.quantity && (
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Số lượng</div>
                                                <div className="text-sm text-slate-700">{selectedMessage.quantity}</div>
                                            </div>
                                        )}
                                        {selectedMessage.budget && (
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Ngân sách</div>
                                                <div className="text-sm text-slate-700">{selectedMessage.budget}</div>
                                            </div>
                                        )}
                                        {selectedMessage.timeline && (
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Thời gian</div>
                                                <div className="text-sm text-slate-700">{selectedMessage.timeline}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                <div className="mb-8">
                                    <div className="text-xs font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
                                        <Clock size={12} /> Gửi lúc: {new Date(selectedMessage.created_at).toLocaleString()}
                                    </div>
                                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        {selectedMessage.description}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.product_category}`}
                                        className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Send size={18} /> Phản hồi qua Email
                                    </a>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedMessage.id, (selectedMessage.status === 'unread' || selectedMessage.status === 'new') ? 'read' : 'unread')}
                                        className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                    >
                                        {(selectedMessage.status === 'unread' || selectedMessage.status === 'new') ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-3 border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all"
                                        title="Xóa tin nhắn"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 border-dashed p-12">
                            <div className="mb-4 p-4 bg-slate-100 rounded-full">
                                <MessageSquare size={48} className="text-slate-300" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-lg">Chọn một tin nhắn</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm">Chọn một liên hệ từ danh sách bên trái để đọc nội dung chi tiết.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
